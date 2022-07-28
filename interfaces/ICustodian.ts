import {
    KeyAlgorithm, KeyFormat, DIDMethod,
    PresentCredentialsRequest, PresentCredentialIDsRequest,
} from '../core/utils';

export interface ICustodian {

    getKeys(): Promise<any>;
    getKey(keyId: string): Promise<any>;
    generateKey(algorithm: KeyAlgorithm): Promise<any>;
    deleteKey(keyId: string): Promise<any>;
    exportKey(key: any, format: KeyFormat, exportPrivate: boolean): Promise<any> 
    importKey(formattedKey: object): Promise<any>;

    getDIDs(): Promise<any>;
    getDID(did: string): Promise<any>;
    createDID(method: DIDMethod, keyId: string, didWebDomain?: string, didWebPath?: string): Promise<string> 
    deleteDID(did: string): Promise<any>;
    resolveDID(did: string): Promise<string>;
    importDID(did: string): Promise<any>;

    getCredentials(): Promise<any>;
    getCredential(id: string): Promise<any>;
    // getCredentialIDs(): Promise<any>;
    storeCredential(alias: string, credential: object): Promise<void>;
    deleteCredential(alias: string): Promise<void>;
    presentCredentials(request: PresentCredentialsRequest | PresentCredentialIDsRequest): Promise<any>;

}