import { 
    callAPI, apiPortCustodian, 
    KeyAlgorithm, KeyFormat, DIDMethod,
    PresentCredentialsRequest, PresentCredentialIDsRequest,
    staticImplements, getId,
} from './utils';

import { ICustodian } from '../interfaces/ICustodian';

@staticImplements<ICustodian>()
export class Custodian {

    /*//////////////////////////////////////////////////////////////
                                 HELPERS
    //////////////////////////////////////////////////////////////*/
    
    static async deleteAllKeys() {
        let keys = await this.getKeys();
        for (let key of keys) {
            await this.deleteKey(key);
        }
    }

    static async deleteAllDIDs() {
        let dids = await this.getDIDs();
        for (let did of dids) {
            await this.deleteDID(did);
        }
    }

    /*//////////////////////////////////////////////////////////////
                             KEYS MANAGEMENT
    //////////////////////////////////////////////////////////////*/

    /**
     * 
     * @returns Array of Key objects
     */
    static async getKeys(): Promise<Array<any>> {
        let result = await callAPI(
            "GET",
            apiPortCustodian,
            "/keys"
        );
        return result?.data?.list;
    }

    /**
     * 
     * @param keyId string
     * @returns Key object
     */
    static async getKey(keyId: string): Promise<any> {
        let result = await callAPI(
            "GET",
            apiPortCustodian,
            `/keys/${keyId}`
        );
        return result?.data;
    }
    
    /**
     * 
     * @param keyAlgorithm Algorithm used for the key generation. Admitted values: RSA, EdDSA_Ed25519, ECDSA_Secp256k1
     * @returns Generated key object
     */
    static async generateKey(keyAlgorithm: KeyAlgorithm): Promise<any> {
        var result = await callAPI(
            "POST",
            apiPortCustodian, 
            "/keys/generate", 
            { "keyAlgorithm": keyAlgorithm }
        );
        return result?.data;
    }
    
    /**
     * 
     * @param key Key object or KeyID string
     * @returns Key deletion result
     */
    static async deleteKey(key: any): Promise<boolean> {
        let keyId = getId(key, "key");
        if (keyId) {
            let result = await callAPI(
                "DELETE",
                apiPortCustodian,
                `/keys/${keyId}`,
            );
            return result.status === 200 ? true : false;
        }
        return false;
    }

    /**
     * 
     * @param key Key object or KeyID string
     * @param format The format you want to export the key to. Admitted values: JWK, PEM
     * @param exportPrivate if true, exports the private key (otherwise the public)
     * @returns the exported key
     */
    static async exportKey(
        key: any, 
        format: KeyFormat, 
        exportPrivate: boolean
    ): 
        Promise<any> 
    {
        let keyId = getId(key, "key");
        if (keyId) {
            let key = await this.getKey(keyId);
            if (key) {
                let result = await callAPI(
                    "POST",
                    apiPortCustodian,
                    `/keys/export`,
                    { 
                        "keyAlias": keyId, 
                        "format": format, 
                        "exportPrivate": exportPrivate 
                    }
                );
                return result?.data;
            }
        }
    }

    /**
     * 
     * @param formattedKey is a JWK or PEM object
     * @returns the keyId of the imported key
     */
    static async importKey(formattedKey: object): Promise<any> {
        let result = await callAPI(
            "POST",
            apiPortCustodian,
            "/keys/import",
            formattedKey
        );
        return result?.data?.id;
    }

    /*//////////////////////////////////////////////////////////////
                            DID MANAGEMENT
    //////////////////////////////////////////////////////////////*/

    /**
     * 
     * @returns Array of DID strings
     */
    static async getDIDs(): Promise<Array<string>> {
        let result = await callAPI(
            "GET",
            apiPortCustodian,
            "/did"
        );
        return result?.data;
    }

    /**
     * 
     * @param did DID id string
     * @returns DID object with related metadata
     */
    static async getDID(did: string): Promise<any> {
        let result = await callAPI(
            "GET",
            apiPortCustodian,
            `/did/${did}`
        );
        return result?.data;
    }

    /**
     * 
     * @param method DID method. Admitted values: key, web, ebsi
     * @param key Key object or KeyID string
     * @param didWebDomain DID web domain string
     * @param didWebPath DID web path string
     * @returns DID id string
     */
    static async createDID(
        method: DIDMethod, 
        key: any, 
        didWebDomain?: string, 
        didWebPath?: string
    ): 
        Promise<string> 
    {
        let keyId = getId(key, "key");
        let result = await callAPI(
            "POST",
            apiPortCustodian,
            "/did/create",
            {
                "method": method,
                "keyAlias": keyId,
                "didWebDomain": didWebDomain,
                "didWebPath": didWebPath
            }
        );
        return result?.data;
    }

    /**
     * 
     * @param did DID id string or object
     * @returns DID deletion result
     */ 
    static async deleteDID(did: any): Promise<boolean> {
        let didId = getId(did, "did");
        let result = await callAPI(
            "DELETE",
            apiPortCustodian,
            `/did/${didId}`
        );
        return result.status === 200 ? true : false;
    }

    /**
     * 
     * @param did DID id string
     * @returns DID object with related metadata
     */
    static async resolveDID(did: string): Promise<any> {
        let result = await callAPI(
            "POST",
            apiPortCustodian,
            "/did/resolve",
            { "did": did }
        );
        return result?.data;
    }

    /**
     * 
     * @param did to resolve and import to the underlying data store
     * @returns DID import result
     */
    static async importDID(did: string): Promise<boolean> {
        let result = await callAPI(
            "POST",
            apiPortCustodian,
            "/did/import",
            JSON.parse(JSON.stringify(did))
        )
        return result.status === 200 ? true : false;
    }

    /*//////////////////////////////////////////////////////////////
                         CREDENTIALS MANAGEMENT
    //////////////////////////////////////////////////////////////*/

    /**
     * 
     * @returns Array of Credential objects the custodian knows of
     */
    static async getCredentials(): Promise<Array<any>> {
        let result = await callAPI(
            "GET",
            apiPortCustodian,
            "/credentials"
        );
        return result?.data?.list;
    }

    /**
     * 
     * @param alias Credential id string
     * @returns Credential object
     */
    static async getCredential(alias: string): Promise<any> {
        let result = await callAPI(
            "GET",
            apiPortCustodian,
            `/credentials/${alias}`
        );
        return result?.data;
    }

    // TODO: de-comment when bug is resolved by walt.id
    // /**
    //  * 
    //  * @returns Array of Credential IDs the custodian knows of
    //  */
    // static async getCredentialIDs(): Promise<any> {
    //     let result = await callAPI(
    //         "GET",
    //         apiPortCustodian,
    //         "/credentials/listCredentialIds"
    //     );
    //     return result?.data;
    // }

    /**
     * 
     * @param alias Credential alias string (example: "MyPassport")
     * @param credential Credential object to store
     * @returns Credential storage result
     */
    static async storeCredential(alias: string, credential: object): Promise<boolean> {
        let result = await callAPI(
            "PUT",
            apiPortCustodian,
            `/credentials/${alias}`,
            credential
        );
        return result.status === 200 ? true : false;
    }

    /**
     * 
     * @param alias Credential's alias to delete
     * @returns Credential deletion result
     */
    static async deleteCredential(alias: string): Promise<boolean> {
        let result = await callAPI(
            "DELETE",
            apiPortCustodian,
            `/credentials/${alias}`
        );
        return result.status === 200 ? true : false;
    }

    /**
     * 
     * @param request the request object (refer to the two classes)
     * @returns a Verifiable Presentation object
     */
    static async presentCredentials(
        request: PresentCredentialsRequest | PresentCredentialIDsRequest
    ):
        Promise<any>
    {
        let url = ""
        if (request instanceof PresentCredentialsRequest) {
            url = "/credentials/present";
        } else {
            url = "/credentials/presentIds";
        }
        let result = await callAPI(
            "POST",
            apiPortCustodian,
            url,
            request
        );
        return result?.data;
    }
}