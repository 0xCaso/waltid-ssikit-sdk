import {
    EbsiTimestampRequest,
} from '../core/utils'
export interface IESSIF {

    onboard(bearerToken: string, did: string): Promise<any>;
    auth(did: string): Promise<boolean>;
    registerDID(did: string): Promise<boolean>;
    // createTimestamp(request: EbsiTimestampRequest): Promise<string>;
    
    getTimestampByID(timestampID: string): Promise<any>;
    getTimestampByTXHash(txHash: string): Promise<any>;

}