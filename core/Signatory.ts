import { 
    callAPI, apiPortSignatory,
    VCTemplate, IssueCredentialRequest,
    staticImplements,
} from './utils';

import { ISignatory } from '../interfaces/ISignatory';

@staticImplements<ISignatory>()
export class Signatory {

    /*//////////////////////////////////////////////////////////////
                               CREDENTIALS
    //////////////////////////////////////////////////////////////*/

    /**
     * 
     * @param request is the object containing the request data (refer to IssueCredentialRequest)
     * @returns a W3C Verifiable Credential
     */
    static async issueCredential(request: IssueCredentialRequest): Promise<any> {
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

    // privateRevocationToken: UUIDUUID
    // publicRevocationToken: base32(sha256(privateRevocationToken)).replaceAll("=", "")

    // everyone can check the status of a VC with the publicRevocationToken
    // only the issuer can revoke a VC with the privateRevocationToken

    /**
     * 
     * @param publicRevocationToken is VC's public revocation token, used to check the status of the revocation
     * @returns revocation result: object = { token: string, revoked: boolean, timeOfRevocation: integer }
     */
    static async isRevoked(publicRevocationToken: string): Promise<any> {
        let result = await callAPI(
            "GET", 
            apiPortSignatory,
            `/v1/revocations/${publicRevocationToken}`
        );
        return result?.data;
    }

    /**
     * 
     * @param privateRevocationToken is VC's token for the revoke
     */
    static async revokeCredential(privateRevocationToken: string): Promise<void> {
        await callAPI(
            "POST", 
            apiPortSignatory,
            `/v1/revocations/${privateRevocationToken}`
        );
    }
}