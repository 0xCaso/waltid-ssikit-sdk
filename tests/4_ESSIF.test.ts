import { ESSIF } from '../core/ESSIF';
import { Custodian } from '../core/Custodian';

describe('ESSIF Class', () => {
    let key: any, did: string

    // Go to https://app.preprod.ebsi.eu/users-onboarding, select 'Onboard with Captcha' > 'Desktop Wallet',
    // copy the token and paste it here:
    let bearerToken = "eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE2NTg5MTc4MTAsImlhdCI6MTY1ODkxNjkxMCwiaXNzIjoiZGlkOmVic2k6emNHdnFnWlRIQ3Rramd0Y0tSTDdIOGsiLCJvbmJvYXJkaW5nIjoicmVjYXB0Y2hhIiwidmFsaWRhdGVkSW5mbyI6eyJhY3Rpb24iOiJsb2dpbiIsImNoYWxsZW5nZV90cyI6IjIwMjItMDctMjdUMTA6MTU6MDlaIiwiaG9zdG5hbWUiOiJhcHAucHJlcHJvZC5lYnNpLmV1Iiwic2NvcmUiOjAuOSwic3VjY2VzcyI6dHJ1ZX19.A886KpEvku2rB-dKcsTrypqFXMT0Hmkt5THTQQGInVuhQKMBPI-NqnbbQInrheGYuEUgMa6Kflbu1i4ouItktg";
    
    describe('Registering a new DID', () => {
        it('should onboard a DID', async () => {
            // algo must be "ECDSA_SECP256K1" in order to sign txs on ETH
            key = await Custodian.generateKey("ECDSA_Secp256k1");
            console.log(`Generated key: ${key.keyId.id}`);
            did = await Custodian.createDID("ebsi", key);
            console.log(`Generated DID: ${did}`);
            let VC = await ESSIF.onboard(bearerToken, did);
            let idVC = VC.verifiableCredential.id.split(":");
            expect(idVC[0]).toBe("vc");
            expect(idVC[1]).toBe("ebsi");
        });
        it('should auth a DID', async () => {
            let result = await ESSIF.auth(did);
            expect(result).toBe("Authenticated successfully.");
        });
        it('should register a DID', async () => {
            let result = await ESSIF.registerDID(did);
            expect(result).toBe("Registered successfully.");
        });
    });
});