import {
    EbsiTimestampRequest,
} from '../core/utils'
export interface IESSIF {

    onboard(bearerToken: string, did: any): Promise<any>;
    auth(did: any): Promise<boolean>;
    registerDID(did: any): Promise<boolean>;
    // createTimestamp(request: EbsiTimestampRequest): Promise<string>;
    
    getTimestampByID(timestampID: string): Promise<any>;
    getTimestampByTXHash(txHash: string): Promise<any>;

}