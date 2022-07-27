import { 
    callAPI, apiPortESSIF,
    staticImplements,
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

    static async createTimestamp(did: string, ethDIDAlias: string, data: string): Promise<string> {
        let response = await callAPI(
            "POST",
            apiPortESSIF,
            `/v1/client/timestamp`,
            {
                did: did,
                ethDidAlias: ethDIDAlias,
                data: data,
            }
        );
        if (response.status === 200) {
            return response?.data;
        } else {
            console.log("CreateTimestamp failed.");
            return "";
        }
    }

    static async getTimestampByID(timestampID: string): Promise<string> {
        let response = await callAPI(
            "POST",
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

    static async getTimestampByTXHash(txHash: string): Promise<string> {
        let response = await callAPI(
            "POST",
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