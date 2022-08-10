import {
    callAPI, apiPortUniversalResolver,
} from './utils'

/**
 * refer to https://github.com/decentralized-identity/universal-resolver
 * follow the readme in the linked repo to run the resolver locally
 * and use this class
 * 
 * For did:sov and did:btcr methods you'll need to define
 * into uni-resolver's docker-compose.yml the environment variables
 */
export class UniversalResolver {

    /**
     * 
     * @param did the DID to resolve
     * @returns the resolved DID (with all metadata)
     */
    static async resolveDID(did: string): Promise<any> {
        let result = await callAPI(
            "GET", 
            apiPortUniversalResolver,
            `/1.0/identifiers/${did}`
        );
        return result?.data;
    }

}