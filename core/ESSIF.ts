import { 
    callAPI, apiPortESSIF,
    staticImplements,
} from './utils';

import { IESSIF } from '../interfaces/IESSIF';

@staticImplements<IESSIF>()
export class ESSIF {
    
    /*//////////////////////////////////////////////////////////////
                              ESSIF CLIENT
    //////////////////////////////////////////////////////////////*/
    
        static async onboard(bearerToken: string, did: string): Promise<void> {
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
                console.log("Onboarded successfully.");
            } else {
                console.log("Onboard failed.");
            }
        }
    
        static async auth(did: string): Promise<string> {
            let response = await callAPI(
                "POST",
                `http://localhost:${apiPortESSIF}/auth`,
                {
                    did: did,
                }
            );
            if (response.status === 200) {
                return response.data.bearerToken;
            } else {
                console.log("Auth failed.");
                return "";
            }
        }
    
        static async registerDID(did: string): Promise<string> {
            let response = await callAPI(
                "POST",
                `http://localhost:${apiPortESSIF}/registerDID`,
                {
                    did: did,
                }
            );
            if (response.status === 200) {
                return response.data.did;
            } else {
                console.log("RegisterDID failed.");
                return "";
            }
        }
    
        static async createTimestamp(did: string, ethDIDAlias: string, data: string): Promise<string> {
            let response = await callAPI(
                "POST",
                `http://localhost:${apiPortESSIF}/createTimestamp`,
                {
                    did: did,
                    ethDIDAlias: ethDIDAlias,
                    data: data,
                }
            );
            if (response.status === 200) {
                return response.data.timestampID;
            } else {
                console.log("CreateTimestamp failed.");
                return "";
}