import { 
    callAPI, apiPortESSIF,
    staticImplements, EbsiTimestampRequest,
} from './utils';

import { IESSIF } from '../interfaces/IESSIF';

// https://docs.walt.id/v/ssikit/usage-examples/usage-examples/onboarding-and-dids

@staticImplements<IESSIF>()
export class ESSIF {
    
    /*//////////////////////////////////////////////////////////////
                              ESSIF CLIENT
    //////////////////////////////////////////////////////////////*/
    
    /**
     * 
     * @param bearerToken the token to use for EBSI interaction
     * @param did the DID to onboard
     * @returns the VC of the onboarding, or an error message
     */
    static async onboard(bearerToken: string, did: string): Promise<any> {
        let response = await callAPI(
            "POST",
            apiPortESSIF,
            `/v1/client/onboard`,
            {
                bearerToken: bearerToken,
                did: did,
            }
        );
        return response.status === 200 
            ? JSON.parse(response?.data) 
            : false;
    }

    /**
     * 
     * @param did the DID to auth
     * @returns the result of the call
     */
    static async auth(did: string): Promise<boolean> {
        let response = await callAPI(
            "POST",
            apiPortESSIF,
            `/v1/client/auth`,
            JSON.parse(JSON.stringify(did))
        );
        return response.status === 200 ? true : false;
    }

    /**
     * 
     * @param did the DID to register in EBSI
     * @returns the result of the call
     */
    static async registerDID(did: string): Promise<boolean> {
        let response = await callAPI(
            "POST",
            apiPortESSIF,
            `/v1/client/registerDid`,
            JSON.parse(JSON.stringify(did))
        );
        return response.status === 200 ? true : false;
    }

    // TODO: ask to walt.id team if createTimestamp call is not bugged
    // /**
    //  * 
    //  * @param request the timestamp creation request object (refer to EbsiTimestampRequest)
    //  * @returns the timestamp created
    //  */
    // static async createTimestamp(request: EbsiTimestampRequest): Promise<string> {
    //     let response = await callAPI(
    //         "POST",
    //         apiPortESSIF,
    //         `/v1/client/timestamp`,
    //         request
    //     );
    //     if (response.status === 200) {
    //         return response?.data;
    //     } else {
    //         console.log("CreateTimestamp failed.");
    //         return "";
    //     }
    // }

    /**
     * 
     * @param timestampID the id of the timestamp to get
     * @returns the timestamp object
     */
    static async getTimestampByID(timestampID: string): Promise<any> {
        let response = await callAPI(
            "GET",
            apiPortESSIF,
            `/v1/client/timestamp/id/${timestampID}`,
        );
        return response.status === 200 ? response?.data : "";
    }

    /**
     * 
     * @param txHash the hash of the transaction associated with the timestamp
     * @returns the timestamp object
     */
    static async getTimestampByTXHash(txHash: string): Promise<any> {
        let response = await callAPI(
            "GET",
            apiPortESSIF,
            `/v1/client/timestamp/txhash/${txHash}`,
        );
        return response.status === 200 ? response?.data : "";
    }
    
}