import { Signatory } from '../core/Signatory';
import { Custodian } from '../core/Custodian';
import { 
    IssueCredentialRequest, ProofConfig, ProofType, 
    createBaseToken, deriveRevocationToken, CredentialStatus,
    getRevocationTokenFromCredentialStatus
} from '../core/utils';

async function issueRandomVC(proofType: ProofType) : Promise<any> {
    let issuerKey = await Custodian.generateKey("EdDSA_Ed25519");
    let issuerDID = await Custodian.createDID("key", issuerKey.keyId.id);
    let subjectKey = await Custodian.generateKey("EdDSA_Ed25519");
    let subjectDID = await Custodian.createDID("key", subjectKey.keyId.id);
    let baseToken = createBaseToken();
    let revocationToken = deriveRevocationToken(baseToken);
    let templates = await Signatory.getVCTemplates();
    let credentialStatus = new CredentialStatus(
        issuerDID+"/"+revocationToken, 
        "SimpleCredentialStatus2022"
    );
    let request = new IssueCredentialRequest(
        templates[1],
        new ProofConfig(issuerDID, subjectDID, proofType),
        {credentialStatus}
    )
    let credential = await Signatory.issueCredential(request);
    return [credential, baseToken];
}

describe('Signatory Class', () => {

    describe('Verifiable Credentials', () => {
        it('Should retrieve VC supported templates', async () => {
            let templates = await Signatory.getVCTemplates();
            expect(templates).toBeInstanceOf(Array);
            expect(templates.length).toBeGreaterThan(0);
            expect(typeof templates[0]).toBe('string');
        });
        it('Should retrieve a VC template', async () => {
            let templates = await Signatory.getVCTemplates();
            let template = await Signatory.getVCTemplate(templates[0]);
            expect(template).toBeInstanceOf(Object);
            expect(typeof template.id).toBe('string');
            expect(typeof template.issuer).toBe('string');
        });
    });
    describe('Credentials', () => {
        beforeAll(async () => {
            await Custodian.deleteAllKeys();
            await Custodian.deleteAllDIDs();
        });
        it('should issue a credential', async () => {
            let proofType: ProofType = "LD_PROOF";
            let credential = await issueRandomVC(proofType);
            console.log(credential);
            if (proofType !== "LD_PROOF") {
                expect(typeof credential).toBe("string")
            } else {
                expect(typeof credential).toBe("object");
            }
        });
    });

    describe('Revocations', () => {
        it('should check if a credential is revoked', async () => {
            let baseToken = createBaseToken();
            let revocationToken = deriveRevocationToken(baseToken);
            let result = await Signatory.isRevoked(revocationToken);
            expect(result.isRevoked).toBe(false);
        });
        it('should revoke a credential', async () => {
            let baseToken = createBaseToken();
            let revocationToken = deriveRevocationToken(baseToken);
            let result = await Signatory.isRevoked(revocationToken);
            expect(result.isRevoked).toBe(false);
            await Signatory.revokeCredential(baseToken);
            result = await Signatory.isRevoked(revocationToken);
            expect(result.isRevoked).toBe(true);
        });
        it('should revoke a previously issued credential', async () => {
            let proofType: ProofType = "LD_PROOF";
            let result = await issueRandomVC(proofType);
            let baseToken = result[1];
            let revocationToken = getRevocationTokenFromCredentialStatus(result[0].credentialStatus);
            result = await Signatory.isRevoked(revocationToken);
            expect(result.isRevoked).toBe(false);
            await Signatory.revokeCredential(baseToken);
            result = await Signatory.isRevoked(revocationToken);
            expect(result.isRevoked).toBe(true);
        });
    });

});
