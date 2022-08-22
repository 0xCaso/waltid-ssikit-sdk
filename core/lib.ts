import Custodian from './Custodian';
import Signatory from './Signatory';
import ESSIF from './ESSIF';
import * as utils from '../core/utils';

/**
 * 
 * @param proofType is the type of the proof in the VC
 * @param subjectDID is the DID of the subject of the VC
 * @returns a VC and the private revocation token for the issuer
 */
export async function issueRandomVC(proofType: utils.ProofType, subjectDID?: string) : Promise<any> {
    let issuerKey: utils.Key = await Custodian.generateKey("EdDSA_Ed25519");
    let issuerDID = await Custodian.createDID("key", issuerKey);
    if (!subjectDID) {
        let subjectKey: utils.Key = await Custodian.generateKey("EdDSA_Ed25519");
        subjectDID = await Custodian.createDID("key", subjectKey);
    }
    let baseToken = utils.createBaseToken();
    let revocationToken = utils.deriveRevocationToken(baseToken);
    // let templates = await Signatory.getVCTemplates();
    let credentialStatus: utils.CredentialStatus = {
        id: `http://localhost:${utils.apiPortSignatory}/v1/revocations/`+revocationToken, 
        type: "SimpleCredentialStatus2022"
    };
    let config: utils.ProofConfig = {
        issuerDid: issuerDID, 
        subjectDid: subjectDID, 
        proofType: proofType
    }
    let request: utils.IssueCredentialRequest = {
        templateId: "VerifiableId",
        config: config,
        credentialData: {credentialStatus}
    };
    let credential = await Signatory.issueCredential(request);
    console.log(JSON.stringify(credential))
    return [credential, baseToken];
}

/**
 * 
 * @param bearerToken the token to use for EBSI interaction
 * @param did the DID to register
 * @returns DID registration result
 */
export async function registerDIDOnEBSI(bearerToken: string, did: string): Promise<string> {
    const timeout = async (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    let onboard = await ESSIF.onboard(bearerToken, did);
    if (onboard) {
        let auth = await ESSIF.auth(did);
        if (auth) {
            let register = await ESSIF.registerDID(did);
            if (register) {
                console.log("DID registered successfully");
                await timeout(10000);
                let resolved = await Custodian.resolveDID(did)
                return JSON.stringify(resolved, null, 2);
            }
        }
    }
    console.log("DID registration failed");
    return "";
}