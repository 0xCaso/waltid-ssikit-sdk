import { 
    callAPI, apiPortSignatory,
    VCTemplate, IssueCredentialRequest,
} from './utils';

export class Signatory {

    /*//////////////////////////////////////////////////////////////
                               CREDENTIALS
    //////////////////////////////////////////////////////////////*/

    /**
     * 
     * @param request is the object containing the request data (refer to IssueCredentialRequest)
     * @returns a W3C Verifiable Credential
     */
    static async issueCredential(request: IssueCredentialRequest) {
        let result = await callAPI(
            "POST", 
            apiPortSignatory,
            "/v1/credentials/issue",
            request
        );
        return result?.data;
    }

    /*//////////////////////////////////////////////////////////////
                         VERIFIABLE CREDENTIALS
    //////////////////////////////////////////////////////////////*/

    /**
     * 
     * @returns a list of templates ids, which can be used by walt.id Signatory API
     */
    static async getVCTemplates(): Promise<any> {
        let result = await callAPI(
            "GET", 
            apiPortSignatory,
            "/v1/templates"
        );
        return result?.data;
    }

    /**
     * 
     * @param templateId is a template id, which can be used by walt.id Signatory API
     * @returns the template object
     */
    static async getVCTemplate(templateId: VCTemplate): Promise<any> {
        let result = await callAPI(
            "GET", 
            apiPortSignatory,
            `/v1/templates/${templateId}`
        );
        return result?.data;
    }

    /*//////////////////////////////////////////////////////////////
                               REVOCATIONS
    //////////////////////////////////////////////////////////////*/

    // TODO: check the response of the API call
    /**
     * 
     * @param revocationToken is VC's token for the revoke
     * @returns 
     */
    static async checkIfVCRevoked(revocationToken: string): Promise<any> {
        let result = await callAPI(
            "GET", 
            apiPortSignatory,
            `/v1/revocations/${revocationToken}`
        );
        return result?.data;
    }

    // TODO: check the response of the API call
    /**
     * 
     * @param notDelegatedRevocationToken is VC's token for the revoke
     * @returns 
     */
    static async revokeVC(notDelegatedRevocationToken: string): Promise<any> {
        let result = await callAPI(
            "POST", 
            apiPortSignatory,
            `/v1/revocations/${notDelegatedRevocationToken}`
        );
        return result?.data;
    }
}