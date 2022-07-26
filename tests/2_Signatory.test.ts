import Signatory from '../core/Signatory';
import Custodian from '../core/Custodian';
import { issueRandomVC } from '../core/lib';
import * as utils from '../core/utils';

describe('Signatory Class', () => {

    describe('Verifiable Credentials', () => {
        it('should retrieve VC supported templates', async () => {
            let templates = await Signatory.getVCTemplateIDs();
            expect(templates).toBeInstanceOf(Array);
            expect(templates.length).toBeGreaterThan(0);
            expect(typeof templates[0]).toBe('string');
        });
        it('should retrieve a VC template', async () => {
            let templates = await Signatory.getVCTemplateIDs();
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
            let proofType: utils.ProofType = "LD_PROOF";
            let credential = await issueRandomVC(proofType);
            if (proofType !== "LD_PROOF") {
                expect(typeof credential).toBe("string")
            } else {
                expect(typeof credential).toBe("object");
            }
        });
    });

    describe('Revocations', () => {
        it('should check if a credential is revoked', async () => {
            let baseToken = utils.createBaseToken();
            let revocationToken = utils.deriveRevocationToken(baseToken);
            let result = await Signatory.isRevoked(revocationToken);
            expect(result.isRevoked).toBe(false);
        });
        it('should revoke a credential', async () => {
            let baseToken = utils.createBaseToken();
            let revocationToken = utils.deriveRevocationToken(baseToken);
            let result = await Signatory.isRevoked(revocationToken);
            expect(result.isRevoked).toBe(false);
            await Signatory.revokeCredential(baseToken);
            result = await Signatory.isRevoked(revocationToken);
            expect(result.isRevoked).toBe(true);
        });
        it('should revoke a previously issued credential', async () => {
            let proofType: utils.ProofType = "LD_PROOF";
            let result = await issueRandomVC(proofType);
            let baseToken = result[1];
            let revocationToken = utils.getRevocationTokenFromCredentialStatus(result[0].credentialStatus);
            result = await Signatory.isRevoked(revocationToken);
            expect(result.isRevoked).toBe(false);
            await Signatory.revokeCredential(baseToken);
            result = await Signatory.isRevoked(revocationToken);
            expect(result.isRevoked).toBe(true);
        });
    });

});
