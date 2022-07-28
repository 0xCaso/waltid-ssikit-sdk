import { Custodian } from './core/Custodian';
import { Signatory } from './core/Signatory';
import * as utils from './core/utils';
import { issueRandomVC } from './core/lib'
import { EbsiTimestampRequest } from './core/utils';
import { ESSIF } from './core/ESSIF';
import fs from 'fs';

async function main() {
    if (!utils.debug) {
        console.warn("ATTENTION: debug mode is disabled, so console.log is not shown. Enable it in utils.ts.")
    }
    await issueRandomVC("LD_PROOF");

    /*//////////////////////////////////////////////////////////////
                        ONBOARD + CREATETIMESTAMP
    //////////////////////////////////////////////////////////////*/
    // let bearerToken = "";
    // fs.readFile('./tests/sessionToken.json', (err, data) => {
    //     bearerToken = JSON.parse(data.toString()).sessionToken;
    // })
    // let key = await Custodian.generateKey("ECDSA_Secp256k1");
    // let did = await Custodian.createDID("ebsi", key);
    // await ESSIF.onboard(bearerToken, did);
    // await ESSIF.auth(did);
    // let data = {"test":"test"};
    // let request = new EbsiTimestampRequest(did, data);
    // let result = await ESSIF.createTimestamp(request);
    // console.log(result)
}

main()