import axios from 'axios';

type Call = "GET" | "POST" | "DELETE";
type Port = 7000 | 7001 | 7002 | 7003 | 7004;

class Key {
    public id: string;

    constructor(_id: string) {
        this.id = _id;
    }
}

const api: { [key: string]: Port } = {
    Core: 7000,
    Signatory: 7001,
    Custodian: 7002,
    Auditor: 7003,
    ESSIF: 7004,
}

async function callAPI(
    type: Call,
    port: Port,
    url: string,
    params?: object
): 
    Promise<any> 
{
    let response
    let config = params;
    if (type === "GET") {
        response = await axios.get(`http://0.0.0.0:${port}${url}`, config);
    } else 
    if (type === "POST") {
        response = await axios.post(`http://0.0.0.0:${port}${url}`, config);
    } else 
    if (type === "DELETE") {
        response = await axios.delete(`http://0.0.0.0:${port}${url}`, config);
    }
    return response
}

async function createKey(): Promise<Key> {
    var response = await callAPI(
        "POST",
        api.Core, 
        "/v1/key/gen", 
        { "keyAlgorithm": "EdDSA_Ed25519" }
    );
    let key = new Key(response.data.id);
    console.log(`Key created: ${key.id}`);
    return key;
}

async function getKeysList(): Promise<any> {
    var response = await callAPI(
        "GET", 
        api.Core, 
        "/v1/key"
    );
    let keysList = response.data;
    if (keysList.length != 0) {
        console.log("Keys found:\n");
        keysList.forEach((value: string, key: string) => {
            console.log(`${key}: ${value}`);
        });
    } else {
        console.log("There are no saved keys yet.");
    }
    return keysList;
}

async function deleteKey(): Promise<any> {

}

async function main() {
    let key = await createKey();
    await getKeysList();
    await deleteKey();
}

main()