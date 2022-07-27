import * as utils from './utils'

import { Custodian } from './Custodian';
import { Signatory } from './Signatory';
import { Auditor } from './Auditor';

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