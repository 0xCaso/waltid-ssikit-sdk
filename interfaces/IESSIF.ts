import {
    EbsiTimestampRequest,
} from '../core/utils'
export interface IESSIF {

    onboard(bearerToken: string, did: string): Promise<any>;
    auth(did: string): Promise<string>;
    registerDID(did: string): Promise<string>;
    createTimestamp(request: EbsiTimestampRequest): Promise<string>;
    
    getTimestampByID(timestampID: string): Promise<any>;
    getTimestampByTXHash(txHash: string): Promise<any>;

}