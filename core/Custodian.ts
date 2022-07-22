import { 
    callAPI, apiPorts, 
    KeyAlgorithm, KeyFormat, DIDMethod
} from './utils';

/**
 * @class Custodian
 * @description This class is used to manage keys and their associated
 */
export class Custodian {

    /*//////////////////////////////////////////////////////////////
                                 HELPERS
    //////////////////////////////////////////////////////////////*/

    static async printKeys(): Promise<void> {
        console.log("──────────────────────────────────────────")
        let keys: Array<any> = await this.getKeys();
        if (keys.length != 0) {
            console.log("Keys found:\n");
            for (let key of keys) {
                console.log(key.keyId.id);
            }
        } else {
            console.log("There are no saved keys yet.");
        }
        console.log("──────────────────────────────────────────")
    }
    
    static async deleteAllKeys() {
        // console.log("──────────────────────────────────────────")
        // console.log("Deleting all keys...\n");
        let keys = await this.getKeys();
        for (let key of keys) {
            await this.deleteKey(key.keyId.id);
        }
        // console.log("\nDone.");
        // console.log("──────────────────────────────────────────")
    }

    static async deleteAllDIDs() {
        let dids = await this.getDIDs();
        for (let did of dids) {
            await this.deleteDID(did);
        }
    }

    private static checkIfStringOrObject(param: any, type: string): string {
        let id: string = "";
        if (typeof param === "string") {
            id = param;
        } else {
            if (type === "key") {
                id = param?.keyId?.id;
            } else if (type === "did") {
                id = param?.id;
            }
        }
        return id;
    }

    /*//////////////////////////////////////////////////////////////
                             KEYs MANAGEMENT
    //////////////////////////////////////////////////////////////*/

    /**
     * 
     * @returns Array of Key objects
     */
    static async getKeys(): Promise<any> {
        let result = await callAPI(
            "GET",
            apiPorts.Custodian,
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
            apiPorts.Custodian,
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
            apiPorts.Custodian, 
            "/keys/generate", 
            { "keyAlgorithm": keyAlgorithm }
        );
        return result?.data;
    }
    
    /**
     * 
     * @param key Key object or KeyID string
     */
    static async deleteKey(key: any) {
        let keyId = this.checkIfStringOrObject(key, "key");
        if (keyId) {
            await callAPI(
                "DELETE",
                apiPorts.Custodian,
                `/keys/${keyId}`,
            );
        }
    }

    /**
     * 
     * @param key Key object or KeyID string
     * @param format The format you want to export the key to. Admitted values: JWK, PEM
     * @param exportPrivate 
     * @returns 
     */
    static async exportKey(
        key: any, 
        format: KeyFormat, 
        exportPrivate: boolean
    ): 
        Promise<any> 
    {
        let keyId = this.checkIfStringOrObject(key, "key");
        if (keyId) {
            let key = await this.getKey(keyId);
            if (key) {
                let result = await callAPI(
                    "POST",
                    apiPorts.Custodian,
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
            apiPorts.Custodian,
            "/keys/import",
            formattedKey
        );
        return result?.data?.id;
    }

    /*//////////////////////////////////////////////////////////////
                            DIDs MANAGEMENT
    //////////////////////////////////////////////////////////////*/

    /**
     * 
     * @returns Array of DID strings
     */
    static async getDIDs(): Promise<any> {
        let result = await callAPI(
            "GET",
            apiPorts.Custodian,
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
            apiPorts.Custodian,
            `/did/${did}`
        );
        return result?.data;
    }

    /**
     * 
     * @param method DID method. Admitted values: key, web, ebsi
     * @param keyId KeyID string
     * @param didWebDomain DID web domain string
     * @param didWebPath DID web path string
     * @returns DID id string
     */
    static async createDID(
        method: DIDMethod, 
        keyId: string, 
        didWebDomain?: string, 
        didWebPath?: string
    ): 
        Promise<string> 
    {
        let result = await callAPI(
            "POST",
            apiPorts.Custodian,
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
     */ 
    static async deleteDID(did: any) {
        let didId = this.checkIfStringOrObject(did, "did");
        await callAPI(
            "DELETE",
            apiPorts.Custodian,
            `/did/${didId}`
        );
    }

    /**
     * 
     * @param did DID id string
     * @returns DID object with related metadata
     */
    static async resolveDID(did: string): Promise<any> {
        let result = await callAPI(
            "POST",
            apiPorts.Custodian,
            "/did/resolve",
            { "did": did }
        );
        return result?.data;
    }

    /*//////////////////////////////////////////////////////////////
                         CREDENTIALs MANAGEMENT
    //////////////////////////////////////////////////////////////*/

    /**
     * 
     * @returns Array of Credential objects
     */
    static async getCredentials(): Promise<any> {
        let result = await callAPI(
            "GET",
            apiPorts.Custodian,
            "/credentials"
        );
        return result?.data?.list;
    }
}