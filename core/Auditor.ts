import { 
    callAPI, apiPortAuditor, VerificationRequest,
    DynamicPolicyArg,
} from './utils';
import * as utils from './utils';

import { IAuditor } from '../interfaces/IAuditor';

@utils.staticImplements<IAuditor>()
export default class Auditor {

    /*//////////////////////////////////////////////////////////////
                          VERIFICATION POLICIES
    //////////////////////////////////////////////////////////////*/

    /**
     * 
     * @returns an array of VerificationPolicy JSON objects { applyToVC, applyToVP, id, description }
     */
    static async getVerificationPolicies(): Promise<Array<any>> {
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
     * @returns a VerificationResponse JSON object { valid, results }
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
     * @returns the policy creation result
     */
    static async createDynamicVerificationPolicy(
        name: string,
        arg: DynamicPolicyArg,
        update?: boolean,
        downloadPolicy?: boolean
    ): 
        Promise<boolean> 
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
        return result.status === 200 ? true : false;
    }

    /**
     * 
     * @param name is the name of the policy to delete
     * @returns the policy deletion result
     */
    static async deleteDynamicVerificationPolicy(
        name: string
    ): 
        Promise<boolean> 
    {
        let result = await callAPI(
            "DELETE",
            apiPortAuditor,
            `/v1/delete/${name}`
        );
        return result.status === 200 ? true : false;
    }

}