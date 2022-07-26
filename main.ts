import { Custodian } from './core/Custodian';
import { Signatory } from './core/Signatory';
import * as utils from './core/utils';

async function custodianKeys() {
    console.log(`    
    /*//////////////////////////////////////////////////////////////
                             KEY MANAGEMENT
    //////////////////////////////////////////////////////////////*/
    `)
    await Custodian.deleteAllKeys();
    console.log("Creating 5 keys...\n");
    let keys: Array<any> = [];
    for (let i = 0; i < 5; i++) {
        let key = await Custodian.generateKey("RSA");
        keys.push(key);
    }
    await Custodian.printKeys();
    console.log("Deleting first 2 keys...\n");
    await Custodian.deleteKey(keys[0].keyId.id);
    await Custodian.deleteKey(keys[1].keyId.id);
    await Custodian.printKeys();
}

export async function issueRandomVC(proofType: utils.ProofType, subjectDID?: string) : Promise<any> {
    let issuerKey = await Custodian.generateKey("EdDSA_Ed25519");
    let issuerDID = await Custodian.createDID("key", issuerKey.keyId.id);
    if (!subjectDID) {
        let subjectKey = await Custodian.generateKey("EdDSA_Ed25519");
        subjectDID = await Custodian.createDID("key", subjectKey.keyId.id);
    }
    let baseToken = utils.createBaseToken();
    let revocationToken = utils.deriveRevocationToken(baseToken);
    let templates = await Signatory.getVCTemplates();
    let credentialStatus = new utils.CredentialStatus(
        `http://localhost:${utils.apiPortSignatory}/v1/revocations/`+revocationToken, 
        "SimpleCredentialStatus2022"
    );
    let request = new utils.IssueCredentialRequest(
        templates[1],
        new utils.ProofConfig(issuerDID, subjectDID, proofType),
        {credentialStatus}
    )
    let credential = await Signatory.issueCredential(request);
    return [credential, baseToken];
}

async function main() {
    let [cred, ] = await issueRandomVC("LD_PROOF");
    console.log(1)
    console.log(cred)
    await Custodian.storeCredential("MIA", cred);
    let stored = await Custodian.getCredential("MIA");
    console.log(2)
    console.log(stored)
    await Custodian.deleteCredential("MIA");
    console.log(3)
    await Custodian.getCredential("MIA");
}

main()