import Auditor from '../core/Auditor';
import { issueRandomVC } from '../core/lib';
import * as utils from '../core/utils';

describe('Auditor Class', () => {

    // must run ./ssikit.sh with "sudo" or this test could fail
    describe('Verification Policies', () => {
        it('should retrieve the verification policies', async () => {
            let policies = await Auditor.getVerificationPolicies();
            expect(policies).toBeInstanceOf(Array);
            expect(policies.length).toBeGreaterThan(0);
            expect(typeof policies[0].id).toBe('string');
        });
        it('should verify a W3C credential', async () => {
            let proofType: utils.ProofType = "LD_PROOF";
            let [credential,] = await issueRandomVC(proofType);
            let [credential2,] = await issueRandomVC(proofType);
            let CredentialStatusPolicy = {
                policy: "CredentialStatusPolicy"
            }
            let SignaturePolicy = {
                policy: "SignaturePolicy"
            }
            let request: utils.VerificationRequest = {
                policies: [ CredentialStatusPolicy, SignaturePolicy ],
                credentials: [ credential, credential2 ],
            }
            let result = await Auditor.verifyCredential(request);
            expect(result.valid).toBe(true);
        });
        it('should create a dynamic verification policy, and delete', async () => {
            let policyName = "MyPolicy";
            let update = true;
            let downloadPolicy = true;
            let input = {};
            let arg: utils.DynamicPolicyArg = {
                name: policyName,
                policyEngine: "OPA",
                applyToVC: true,
                applyToVP: true,
                input: input,
                policy: "",
                dataPath: "",
                policyQuery: "",
                description: "test"
            }
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
