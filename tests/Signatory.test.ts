import { Signatory } from '../core/Signatory';
import { Custodian } from '../core/Custodian';
import { IssueCredentialRequest, ProofConfig, ProofType } from '../core/utils';

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
            let issuerKey = await Custodian.generateKey("EdDSA_Ed25519");
            let issuerDID = await Custodian.createDID("key", issuerKey.keyId.id);
            let subjectKey = await Custodian.generateKey("EdDSA_Ed25519");
            let subjectDID = await Custodian.createDID("key", subjectKey.keyId.id);
            let templates = await Signatory.getVCTemplates();
            let proofType: ProofType = undefined;
            let request = new IssueCredentialRequest(
                templates[0],
                new ProofConfig(issuerDID, subjectDID, proofType)
            )
            let result = await Signatory.issueCredential(request);
            if (proofType) {
                expect(typeof result).toBe("string");
            } else {
                expect(typeof result).toBe("object");
            }
        });
    });

});
