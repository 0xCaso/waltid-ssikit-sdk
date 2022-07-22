import { 
    callAPI, apiPorts, KeyAlgorithm, KeyFormat,
} from './utils';

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
        console.log("──────────────────────────────────────────")
        console.log("Deleting all keys...\n");
        let keys: Array<any> = await this.getKeys();
        for (let key of keys) {
            await this.deleteKey(key.keyId.id);
        }
        console.log("\nDone.");
        console.log("──────────────────────────────────────────")
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
            apiPorts.Custodian,
            "/keys"
        );
        result = result.data.list;
        return result;
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
        if (result?.data) {
            result = result?.data;
        } else {
            result = null;
            console.log(`Key ${keyId} not found.`);
        }
        return result;
    }
    
    /**
     * 
     * @param keyAlgorithm Algorithm used for the key generation. Admitted values: RSA, EdDSA_Ed25519, ECDSA_Secp256k1
     * @returns Generated key object
     */
    static async generateKey(keyAlgorithm: KeyAlgorithm): Promise<any> {
        console.log("Creating key...");
        var result = await callAPI(
            "POST",
            apiPorts.Custodian, 
            "/keys/generate", 
            { "keyAlgorithm": keyAlgorithm }
        );
        let key = result.data;
        console.log(`Key created: ${key.keyId.id}`);
        return key;
    }
    
    /**
     * 
     * @param key Key object or KeyID string
     */
    static async deleteKey(key: string | any) {
        let keys = await this.getKeys();
        let keyId = "";
        if (typeof key === "string") {
            keyId = key;
        } else {
            keyId = key?.keyId?.id;
        }
        if (!keyId) {
            console.log("ERROR: The parameter must be a Key object or a KeyID string.");
        } else {
            if (keys.find(k => k.keyId.id === keyId) === undefined) {
                console.log(`Key ${keyId} not found.`);
            } else {
                console.log(`Deleting key: ${keyId}`);
                await callAPI(
                    "DELETE",
                    apiPorts.Custodian,
                    `/keys/${keyId}`,
                );
                console.log(`Key deleted: ${keyId}`);
            }
        }
    }

    /**
     * 
     * @param key Key object or KeyID string
     * @param format The format you want to export the key to. Admitted values: JWK, PEM
     * @param exportPrivate 
     * @returns 
     */
    static async exportKey(key: string | any, format: KeyFormat, exportPrivate: boolean): Promise<any> {
        let keyId = "";
        if (typeof key === "string") {
            keyId = key;
        } else {
            keyId = key?.keyId?.id;
        }
        if (!keyId) {
            console.log("ERROR: The parameter must be a Key object or a KeyID string.");
        } else {
            let key = await this.getKey(keyId);
            if (key === null) {
                console.log(`Key ${keyId} not found.`);
            } else {
                console.log(`Exporting key: ${keyId}`);
                let result = await callAPI(
                    "POST",
                    apiPorts.Custodian,
                    `/keys/export`,
                    { "keyAlias": keyId, "format": format, "exportPrivate": exportPrivate }
                );
                console.log(`Key exported: ${keyId}`);
                return result.data;
            }
        }
    }

    /**
     * 
     * @param formattedKey is a JWK or PEM object
     * @returns the keyId of the imported key
     */
    static async importKey(formattedKey: object): Promise<any> {
        console.log("Importing key...");
        let result = await callAPI(
            "POST",
            apiPorts.Custodian,
            "/keys/import",
            formattedKey
        );
        if (result.data.id)
        console.log(`Key imported: ${result.data.id}`);
        return result.data.id;
    }
}