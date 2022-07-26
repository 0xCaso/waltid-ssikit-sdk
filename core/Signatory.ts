import { 
    callAPI, apiPortSignatory, ProofType,
    VCTemplate, IssueCredentialRequest,
    createBaseToken, deriveRevocationToken,
    CredentialStatus, ProofConfig
} from './utils';
// this import is just for the helper function
import { Custodian } from './Custodian';

export class Signatory {

    /*//////////////////////////////////////////////////////////////
                                 HELPERS
    //////////////////////////////////////////////////////////////*/

    static async issueRandomVC(proofType: ProofType, subjectDID?: string) : Promise<any> {
        let issuerKey = await Custodian.generateKey("EdDSA_Ed25519");
        let issuerDID = await Custodian.createDID("key", issuerKey.keyId.id);
        if (!subjectDID) {
            let subjectKey = await Custodian.generateKey("EdDSA_Ed25519");
            subjectDID = await Custodian.createDID("key", subjectKey.keyId.id);
        }
        let baseToken = createBaseToken();
        let revocationToken = deriveRevocationToken(baseToken);
        let templates = await Signatory.getVCTemplates();
        let credentialStatus = new CredentialStatus(
            `http://localhost:${apiPortSignatory}/v1/revocations/`+revocationToken, 
            "SimpleCredentialStatus2022"
        );
        let request = new IssueCredentialRequest(
            templates[1],
            new ProofConfig(issuerDID, subjectDID, proofType),
            {credentialStatus}
        )
        let credential = await Signatory.issueCredential(request);
        return [credential, baseToken];
    }

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
    static async revokeCredential(privateRevocationToken: string) {
        await callAPI(
            "POST", 
            apiPortSignatory,
            `/v1/revocations/${privateRevocationToken}`
        );
    }
}