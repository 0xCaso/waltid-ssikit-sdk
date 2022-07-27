
export interface IESSIF {

    onboard(bearerToken: string, did: string): Promise<any>;
    auth(did: string): Promise<string>;
    registerDID(did: string): Promise<string>;
    createTimestamp(did: string, ethDIDAlias: string, data: string): Promise<string>;
    
    getTimestampByID(timestampID: string): Promise<any>;
    getTimestampByTXHash(txHash: string): Promise<any>;

}