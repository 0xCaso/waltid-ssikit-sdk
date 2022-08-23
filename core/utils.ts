import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { base32 } from "rfc4648";
import sha256 from "fast-sha256";
import nacl from 'tweetnacl-util';

/**
 * if true, it will use the API service hosted by walt.id
 * otherwise, the calls will be made to localhost
 */
export let demo = false;
/**
 * Turn on/off the debug mode for the tests
 */
export let debug = true;
if (!debug) {
    console.log = function() {}
    console.error = function() {}
}

    /*//////////////////////////////////////////////////////////////
                              TYPES / CONST
    //////////////////////////////////////////////////////////////*/

type Call = "GET" | "POST" | "DELETE" | "PUT";
type Port = 7000 | 7001 | 7002 | 7003 | 7004 | 8080;

export const apiPortCore: Port = 7000;
export const apiPortSignatory: Port = 7001;
export const apiPortCustodian: Port = 7002;
export const apiPortAuditor: Port = 7003;
export const apiPortESSIF: Port = 7004;
export const apiPortUniversalResolver: Port = 8080;

export type KeyAlgorithm = "RSA" | "EdDSA_Ed25519" | "ECDSA_Secp256k1";
export type KeyFormat = "JWK" | "PEM";
export type DIDMethod = "key" | "web" | "ebsi";
export type ProofType = "JWT" | "LD_PROOF"; // LD_PROOF is default
export type CredentialStatusType = "SimpleCredentialStatus2022";
export type PolicyEngineType = "OPA";
export type PresentationRequest = PresentCredentialsRequest | PresentCredentialIDsRequest

    /*//////////////////////////////////////////////////////////////
                               INTERFACES
    //////////////////////////////////////////////////////////////*/

export interface Key {
    algorithm: string,
    cryptoProvider: string,
    keyId: {
        id: string,
    },
    keyPair: object,
    keysetHandle: string
}

export interface ProofConfig {
    issuerDid: string;
    subjectDid: string;
    proofType?: ProofType;
    verifierDid?: string;
    issuerVerificationMethod?: string;
    domain?:	string;
    nonce?: string;
    proofPurpose?: string;
    credentialId?: string;
    issueDate?: string;
    validDate?: string;
    expirationDate?: string;
    dataProviderIdentifier?: string;
}

// MANDATORY:
// - templateId
// - issuerDID (inside config)
// - subjectDID (inside config)
export interface IssueCredentialRequest {
    templateId: string;
    config: ProofConfig;
    credentialData?: object;
}

export interface CredentialStatus {
    id: string;
    type: CredentialStatusType;
}

export interface VerificationRequest {
    policies: any[];
    credentials: any[];
}

// https://docs.walt.id/v/ssikit/concepts/verification-policies/dynamic-policies
export interface DynamicPolicyArg {
    name: string;
    policyEngine: PolicyEngineType;
    applyToVC: boolean;
    applyToVP: boolean;
    input: any;
    policy: string;
    dataPath: string;
    policyQuery: string;
    description?: string;
}

export interface PresentCredentialsRequest {
    discriminator: "presentCredentialsRequest";
    vcs: string[];
    holderDid: string;
    verifierDid?: string;
    domain?: string;
    challenge?: string;
}

export interface PresentCredentialIDsRequest {
    discriminator: "presentCredentialIDsRequest";
    vcIds: string[];
    holderDid: string;
    verifierDid?: string;
    domain?: string;
    challenge?: string;
}

export interface EbsiTimestampRequest {
    did: string;
    ethDidAlias?: string;
    data: string;
}

export interface RevocationStatus {
    isRevoked: boolean;
    token: string;
    timeOfRevocation?: number;
}

export interface VerificationPolicy {
    id: string;
    description: string;
    argumentType: string;
    isMutable: boolean;
}

    /*//////////////////////////////////////////////////////////////
                                FUNCTIONS
    //////////////////////////////////////////////////////////////*/

/* class decorator */
export function staticImplements<T>() {
    return <U extends T>(constructor: U) => {constructor};
}

export async function callAPI(
    type: Call,
    port: Port,
    url: string,
    params?: object
): 
    Promise<any> 
{
    let result
    let config = params;
    let callingUrl = `http://localhost:${port}${url}`;
    if (demo && port !== apiPortUniversalResolver) {
        let prefix = "";
        if (port === apiPortCore)
            prefix = "core";
        else if (port === apiPortSignatory)
            prefix = "signatory";
        else if (port === apiPortCustodian)
            prefix = "custodian";
        else if (port === apiPortAuditor)
            prefix = "auditor";
        else if (port === apiPortESSIF)
            prefix = "essif";
        callingUrl = `https://${prefix}.ssikit.walt-test.cloud${url}`;
    }
    try {
        let result = await axios({
            method: type,
            url: callingUrl,
            data: config
        });
        return result
    } catch(err: any) {
        console.error(err.response.data);
        return ""
    }
}

export function getId(param: any, type: string): string {
    let id: string = "";
    if (typeof param === "string") {
        id = param;
    } else {
        if (type === "key") {
            id = param?.keyId?.id;
        } else if (type === "did") {
            id = param?.id;
        }
    }
    return id;
}

export function getRandomUUID(): string {
    return uuidv4();
}

export function createBaseToken(): string {
    return getRandomUUID() + getRandomUUID();
}

export function deriveRevocationToken(baseToken: string): string {
    return base32.stringify(
        sha256(nacl.decodeUTF8(baseToken))
    ).replaceAll("=", "");
}

export function getRevocationTokenFromCredentialStatus(
    credentialStatus: CredentialStatus
): 
    string 
{
    let token = credentialStatus.id.split("/").pop() ?? "";
    return token;
}