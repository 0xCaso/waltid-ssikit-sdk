import { Auditor } from '../core/Auditor';
import { Signatory } from '../core/Signatory';
import { 
    VerificationRequest, ProofType, 
    createBaseToken, deriveRevocationToken, CredentialStatus,
    getRevocationTokenFromCredentialStatus
} from '../core/utils';

describe('Auditor Class', () => {

    describe('Verification Policies', () => {
        it('should retrieve the verification policies', async () => {
            let policies = await Auditor.getVerificationPolicies();
            expect(policies).toBeInstanceOf(Array);
            expect(policies.length).toBeGreaterThan(0);
            expect(typeof policies[0].id).toBe('string');
        });
        it('should verify a W3C credential', async () => {
            let proofType: ProofType = "LD_PROOF";
            let [credential,] = await Signatory.issueRandomVC(proofType);
            let policy = {
                // policy: "CredentialStatusPolicy"
                policy: "SignaturePolicy"
            }
            let request = new VerificationRequest(
                [ policy ],
                [ credential ],
            );
            console.log(JSON.stringify(request));
            let result = await Auditor.verifyCredential(request);
            console.log(result)
            expect(result).toBeInstanceOf(Object);
        });
    });

});
