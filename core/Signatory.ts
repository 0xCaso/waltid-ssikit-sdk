import { 
    callAPI, apiPortSignatory,
    IssueCredentialRequest,
    staticImplements,
    RevocationStatus,
} from './utils';

import { ISignatory } from '../interfaces/ISignatory';

@staticImplements<ISignatory>()
export default class Signatory {

    /*//////////////////////////////////////////////////////////////
                               CREDENTIALS
    //////////////////////////////////////////////////////////////*/

    /**
     * 
     * @param request is the object containing the requested data (refer to IssueCredentialRequest)
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
     * @returns a list of template ids, which can be used by walt.id Signatory API
     */
    static async getVCTemplateIDs(): Promise<Array<string>> {
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
    static async getVCTemplate(templateId: string): Promise<any> {
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
     * @param publicRevocationToken VC's public revocation token, used to check the status of the revocation
     * @returns revocation status
     */
    static async isRevoked(publicRevocationToken: string): Promise<RevocationStatus> {
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
     * @returns credential revocation result
     */
    static async revokeCredential(privateRevocationToken: string): Promise<boolean> {
        let result = await callAPI(
            "POST", 
            apiPortSignatory,
            `/v1/revocations/${privateRevocationToken}`
        );
        return result.status === 201 ? true : false;
    }
}