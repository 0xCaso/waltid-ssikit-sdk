import {
    KeyAlgorithm, KeyFormat, DIDMethod,
    PresentCredentialsRequest, PresentCredentialIDsRequest,
} from '../core/utils';

export interface ICustodian {

    getKeys(): Promise<Array<any>>;
    getKey(keyId: string): Promise<any>;
    generateKey(algorithm: KeyAlgorithm): Promise<any>;
    deleteKey(keyId: string): Promise<boolean>;
    exportKey(key: any, format: KeyFormat, exportPrivate: boolean): Promise<any> 
    importKey(formattedKey: object): Promise<any>;

    getDIDs(): Promise<Array<string>>;
    getDID(did: string): Promise<any>;
    createDID(method: DIDMethod, keyId: string, didWebDomain?: string, didWebPath?: string): Promise<string> 
    deleteDID(did: string): Promise<boolean>;
    resolveDID(did: string): Promise<string>;
    importDID(did: string): Promise<boolean>;

    getCredentials(): Promise<Array<any>>;
    getCredential(alias: string): Promise<any>;
    // getCredentialIDs(): Promise<any>;
    storeCredential(alias: string, credential: object): Promise<boolean>;
    deleteCredential(alias: string): Promise<boolean>;
    presentCredentials(request: PresentCredentialsRequest | PresentCredentialIDsRequest): Promise<any>;

}