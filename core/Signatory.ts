import { 
    callAPI, apiPortSignatory,
    KeyAlgorithm, KeyFormat, DIDMethod,
    VCTemplate, IssueCredentialRequest,
} from './utils';

export class Signatory {

    /*//////////////////////////////////////////////////////////////
                               CREDENTIALS
    //////////////////////////////////////////////////////////////*/

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

}