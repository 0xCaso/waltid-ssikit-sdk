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
        if (response.status === 200) {
            return JSON.parse(response?.data);
        } else {
            return "Onboard failed.";
        }
    }

    /**
     * 
     * @param did the DID to auth
     * @returns the result of the call
     */
    static async auth(did: string): Promise<string> {
        let response = await callAPI(
            "POST",
            apiPortESSIF,
            `/v1/client/auth`,
            JSON.parse(JSON.stringify(did))
        );
        if (response.status === 200) {
            return "Authenticated successfully.";
        } else {
            return "Auth failed.";
        }
    }

    /**
     * 
     * @param did the DID to register in EBSI
     * @returns the result of the call
     */
    static async registerDID(did: string): Promise<string> {
        let response = await callAPI(
            "POST",
            apiPortESSIF,
            `/v1/client/registerDid`,
            JSON.parse(JSON.stringify(did))
        );
        if (response.status === 200) {
            return "Registered successfully.";
        } else {
            console.log("RegisterDID failed.");
            return "RegisterDID failed.";
        }
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
        if (response.status === 200) {
            return response?.data;
        } else {
            console.log("GetTimestampByID failed.");
            return "";
        }
    }

    /**
     * 
     * @param txHash the hash of the transaction associated to the timestamp
     * @returns the timestamp object
     */
    static async getTimestampByTXHash(txHash: string): Promise<any> {
        let response = await callAPI(
            "GET",
            apiPortESSIF,
            `/v1/client/timestamp/txhash/${txHash}`,
        );
        if (response.status === 200) {
            return response?.data;
        } else {
            console.log("GetTimestampByTXHash failed.");
            return "";
        }
    }
    
}