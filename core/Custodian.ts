import { Key, callAPI, apiPorts } from './utils';

export class Custodian {

    /*//////////////////////////////////////////////////////////////
                                 HELPERS
    //////////////////////////////////////////////////////////////*/

    static async printKeys(): Promise<void> {
        console.log("──────────────────────────────────────────")
        let keys: Array<Key> = await this.getKeys();
        if (keys.length != 0) {
            console.log("Keys found:\n");
            for (let key of keys) {
                console.log(key.id);
            }
        } else {
            console.log("There are no saved keys yet.");
        }
        console.log("──────────────────────────────────────────")
    }
    
    static async deleteAllKeys() {
        console.log("──────────────────────────────────────────")
        console.log("Deleting all keys...");
        let keys = await this.getKeys();
        for (let key of keys) {
            await this.deleteKey(key);
        }
        console.log("Done.");
        console.log("──────────────────────────────────────────")
    }

    /*//////////////////////////////////////////////////////////////
                             KEYS MANAGEMENT
    //////////////////////////////////////////////////////////////*/

    static async getKeys(): Promise<Array<Key>> {
        var response = await callAPI(
            "GET", 
            apiPorts.Core, 
            "/v1/key"
        );
        let keysList = response.data;
        let keys: Array<Key> = [];
        for (let key of keysList) {
            keys.push(new Key(key));
        }
        return keys;
    }
    
    static async generateKey(): Promise<Key> {
        console.log("Creating key...");
        var response = await callAPI(
            "POST",
            apiPorts.Core, 
            "/v1/key/gen", 
            { "keyAlgorithm": "EdDSA_Ed25519" }
        );
        let key = new Key(response.data.id);
        console.log(`Key created: ${key.id}`);
        return key;
    }
    
    static async deleteKey(key: Key): Promise<any> {
        let keys = await this.getKeys();
        if (keys.find(k => k.id === key.id) === undefined) {
            console.log(`Key ${key.id} not found.`);
        } else {
            console.log(`Deleting key: ${key.id}`);
            await callAPI(
                "DELETE",
                apiPorts.Core,
                `/v1/key/${key.id}`,
                { data: key.id }
            );
            console.log(`Key deleted: ${key.id}`);
        }
    }
}