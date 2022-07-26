import { 
    callAPI, apiPortAuditor, VerificationRequest,
    DynamicPolicyArg, staticImplements,
} from './utils';

import { IAuditor } from '../interfaces/IAuditor';

@staticImplements<IAuditor>()
export class Auditor {

    /*//////////////////////////////////////////////////////////////
                          VERIFICATION POLICIES
    //////////////////////////////////////////////////////////////*/

    /**
     * 
     * @returns an array of VerificationPolicy JSON objects { applyToVC, applyToVP, id, description }
     */
    static async getVerificationPolicies(): Promise<any> {
        let result = await callAPI(
            "GET", 
            apiPortAuditor,
            "/v1/policies"
        );
        return result?.data;
    }

    /**
     * 
     * @param request is the object containing the request data (refer to VerificationRequest type)
     * @returns an array of VerificationResponse objects { valid, results }
     */
    static async verifyCredential(request: VerificationRequest): Promise<any> {
        let result = await callAPI(
            "POST", 
            apiPortAuditor,
            "/v1/verify",
            request
        );
        return result?.data;
    }

    /**
     * 
     * @param name is the name of the policy
     * @param arg is the argument of the policy (refer to DynamicPolicyArg)
     * @param update is a boolean indicating if the policy can be updated
     * @param downloadPolicy is a boolean indicating if the policy can be downloaded
     * @returns a DynamicPolicyArg object
     */
    static async createDynamicVerificationPolicy(
        name: string,
        arg: DynamicPolicyArg,
        update?: boolean,
        downloadPolicy?: boolean
    ): 
        Promise<DynamicPolicyArg> 
    {
        let path = `/v1/create/${name}`;
        if (update !== undefined) {
            path += `?update=${update}`;
        }
        if (downloadPolicy !== undefined) {
            if (update !== undefined) {
                path += "&";
            } else {
                path += "?";
            }
            path += `downloadPolicy=${downloadPolicy}`;
        }
        let result = await callAPI(
            "POST", 
            apiPortAuditor,
            path,
            arg
        );
        return result?.data;
    }

    /**
     * 
     * @param name is the name of the policy to delete
     */
    static async deleteDynamicVerificationPolicy(
        name: string
    ): 
        Promise<void> 
    {
        await callAPI(
            "DELETE",
            apiPortAuditor,
            `/v1/delete/${name}`
        );
    }

}