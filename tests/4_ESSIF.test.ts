import { ESSIF } from '../core/ESSIF';
import { Custodian } from '../core/Custodian';
import fs from 'fs';

jest.setTimeout(50000);

describe('ESSIF Class', () => {
    let key: any, did: string

    // Go to https://app.preprod.ebsi.eu/users-onboarding, select 'Onboard with Captcha' > 'Desktop Wallet',
    // click to download and save it into "tests" folder
    let bearerToken = ""

    fs.stat('./tests/sessionToken.json', (err, stats) => {
        let lastModified = stats.mtime;
        let fifteenMinutesAgo = new Date(new Date().getTime() - 15 * 60 * 1000);
        if (lastModified < fifteenMinutesAgo) {
            console.log("Session token is older than 15 minutes. Please download it and re-run the tests.")
            process.kill(0);
        }
    });

    fs.readFile('./tests/sessionToken.json', (err, data) => {
        bearerToken = JSON.parse(data.toString()).sessionToken;
    })
    
    describe('Registering a new DID', () => {
        it('should onboard a DID', async () => {
            // algo must be "ECDSA_SECP256K1" in order to sign txs on ETH
            key = await Custodian.generateKey("ECDSA_Secp256k1");
            // console.log(`Generated key: ${getId(key, "key")}`);
            did = await Custodian.createDID("ebsi", key);
            console.log(`Generated DID: ${did}`);
            let VC = await ESSIF.onboard(bearerToken, did);
            let idVC = VC.verifiableCredential.id.split(":");
            expect(idVC[0]).toBe("vc");
            expect(idVC[1]).toBe("ebsi");
        });
        it('should auth a DID', async () => {
            let result = await ESSIF.auth(did);
            expect(result).toBe(true);
        });
        it('should register a DID', async () => {
            let result = await ESSIF.registerDID(did);
            expect(result).toBe(true);
        });
    });

    describe('Timestamps', () => {
        // it('should create a timestamp', async () => {
        //     let data = {"test":"test"};
        //     let request = new EbsiTimestampRequest(did, JSON.stringify(data));
        //     let result = await ESSIF.createTimestamp(request);
        //     expect(result.substring(0, 2)).toBe("0x");
        // });
        it('should get a timestamp by ID', async () => {
            // https://api.preprod.ebsi.eu/timestamp/v2/timestamps
            let timestampID = "uEiB42UpqwW7kwZS5aKxG2NGxz59C-cGhSSER7Phg40e7Cw";
            let result = await ESSIF.getTimestampByID(timestampID);
            expect(result).not.toBe("");
            expect(typeof result.blockNumber).toBe('number');
            expect(typeof result.transactionHash).toBe('string');
        });
        it('should get a timestamp by its transactionHash', async () => {
            let timestampID = "uEiB42UpqwW7kwZS5aKxG2NGxz59C-cGhSSER7Phg40e7Cw";
            let timestamp1 = await ESSIF.getTimestampByID(timestampID);
            let timestamp2 = await ESSIF.getTimestampByTXHash(timestamp1.transactionHash);
            expect(timestamp1).not.toBe("");
            expect(timestamp2).not.toBe("");
            expect(timestamp1.blockNumber).toBe(timestamp2.blockNumber);
            expect(timestamp1.timestamp).toBe(timestamp2.timestamp);
        });
    });
});