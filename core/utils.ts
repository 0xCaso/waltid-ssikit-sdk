import axios from 'axios';

type Call = "GET" | "POST" | "DELETE" | "PUT";
type Port = 7000 | 7001 | 7002 | 7003 | 7004;

export const apiPorts: { [key: string]: Port } = {
    Core: 7000,
    Signatory: 7001,
    Custodian: 7002,
    Auditor: 7003,
    ESSIF: 7004,
}

export async function callAPI(
    type: Call,
    port: Port,
    url: string,
    params?: object
): 
    Promise<any> 
{
    let result
    let config = params;
    try {
        if (type === "GET") {
            result = await axios.get(`http://0.0.0.0:${port}${url}`, config);
        } else 
        if (type === "POST") {
            result = await axios.post(`http://0.0.0.0:${port}${url}`, config);
        } else 
        if (type === "DELETE") {
            result = await axios.delete(`http://0.0.0.0:${port}${url}`, config);
        } else
        if (type === "PUT") {
            result = await axios.put(`http://0.0.0.0:${port}${url}`, config);
        }
        return result
    } catch(err: any) {
        console.log(err.response.data)
        return ""
    }
}

export enum KeyAlgorithm { 
    RSA = "RSA", 
    EdDSA_Ed25519 = "EdDSA_Ed25519", 
    ECDSA_Secp256k1= "ECDSA_Secp256k1" 
}
export enum KeyFormat { 
    PEM = "PEM", 
    JWK = "JWK" 
}
// export class KeyId {
//     public id: string;

//     constructor(_id: string) {
//         this.id = _id;
//     }
// }

// export class Key {
//     public id: KeyId;
//     public algorithm: KeyAlgorithm;
//     public cryptoProvider: CryptoProvider;
//     public keysetHandle: KeysetHandle;

//     constructor(
//         _id: string,
//         _algorithm: KeyAlgorithm,
//         _cryptoProvider: CryptoProvider,
//         _keysetHandle: KeysetHandle
//     ) {
//         this.id = new KeyId(_id);
//         this.algorithm = _algorithm;
//         this.cryptoProvider = _cryptoProvider;
//         this.keysetHandle = _keysetHandle;
//     }
// }


