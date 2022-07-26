import { Auditor } from '../core/Auditor';
import { 
    VerificationRequest, ProofType, 
    DynamicPolicyArg,
} from '../core/utils';
import { issueRandomVC } from '../core/lib';

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
            let [credential,] = await issueRandomVC(proofType);
            let CredentialStatusPolicy = {
                policy: "CredentialStatusPolicy"
            }
            let SignaturePolicy = {
                policy: "SignaturePolicy"
            }
            let request = new VerificationRequest(
                [ CredentialStatusPolicy, SignaturePolicy ],
                [ credential ],
            );
            let result = await Auditor.verifyCredential(request);
            expect(result.valid).toBe(true);
        });
        it('should create a dynamic verification policy, and delete', async () => {
            let policyName = "MyPolicy";
            let update = true;
            let downloadPolicy = true;
            let input = {};
            let arg = new DynamicPolicyArg(policyName, "OPA", true, true, input, "", "", "", "test test");
            await Auditor.createDynamicVerificationPolicy(
                policyName,
                arg,
                update,
                downloadPolicy
            );
            let policies = await Auditor.getVerificationPolicies();
            let added = policies[policies.length - 1];
            expect(added.id).toBe(policyName);
            await Auditor.deleteDynamicVerificationPolicy(added.id);
            policies = await Auditor.getVerificationPolicies();
            let last = policies[policies.length - 1];
            expect(last.id).not.toBe(policyName);
        });
    });

});
