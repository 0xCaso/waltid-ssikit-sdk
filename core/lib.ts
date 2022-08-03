import * as utils from './utils'

import { Custodian } from './Custodian';
import { Signatory } from './Signatory';
import { ESSIF } from './ESSIF';

/**
 * 
 * @param proofType is the type of the proof in the VC
 * @param subjectDID is the DID of the subject of the VC
 * @returns a VC and the private revocation token for the issuer
 */
export async function issueRandomVC(proofType: utils.ProofType, subjectDID?: string) : Promise<any> {
    let issuerKey = await Custodian.generateKey("EdDSA_Ed25519");
    let issuerDID = await Custodian.createDID("key", issuerKey);
    if (!subjectDID) {
        let subjectKey = await Custodian.generateKey("EdDSA_Ed25519");
        subjectDID = await Custodian.createDID("key", subjectKey);
    }
    let baseToken = utils.createBaseToken();
    let revocationToken = utils.deriveRevocationToken(baseToken);
    // let templates = await Signatory.getVCTemplates();
    let credentialStatus = new utils.CredentialStatus(
        `http://localhost:${utils.apiPortSignatory}/v1/revocations/`+revocationToken, 
        "SimpleCredentialStatus2022"
    );
    let request = new utils.IssueCredentialRequest(
        "VerifiableId",
        new utils.ProofConfig(issuerDID, subjectDID, proofType),
        {credentialStatus}
    )
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
export async function registerDIDOnEBSI(bearerToken: string, did: string) {
    let onboard = await ESSIF.onboard(bearerToken, did);
    if (onboard) {
        let auth = await ESSIF.auth(did);
        if (auth) {
            let register = await ESSIF.registerDID(did);
            if (register) {
                console.log("DID registered successfully");
                let resolved = Custodian.resolveDID(did)
                console.log(JSON.stringify(resolved))
            }
        }
    }
    console.log("DID registration failed");
}