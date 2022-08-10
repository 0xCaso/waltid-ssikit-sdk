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

type Call = "GET" | "POST" | "DELETE" | "PUT";
type Port = 7000 | 7001 | 7002 | 7003 | 7004 | 8080;

export const apiPortCore: Port = 7000;
export const apiPortSignatory: Port = 7001;
export const apiPortCustodian: Port = 7002;
export const apiPortAuditor: Port = 7003;
export const apiPortESSIF: Port = 7004;
export const apiPortUniversalResolver: Port = 8080;

    /*//////////////////////////////////////////////////////////////
                                  TYPES
    //////////////////////////////////////////////////////////////*/

export type KeyAlgorithm = "RSA" | "EdDSA_Ed25519" | "ECDSA_Secp256k1";
export type KeyFormat = "JWK" | "PEM";
export type DIDMethod = "key" | "web" | "ebsi";
export type ProofType = "JWT" | "LD_PROOF"; // LD_PROOF is default
export type CredentialStatusType = "SimpleCredentialStatus2022";
export type PolicyEngineType = "OPA";
export type VCTemplate =
    | "DataSelfDescription"
    | "VerifiableDiploma"
    | "VerifiableVaccinationCertificate"
    | "LegalPerson"
    | "VerifiableAuthorization"
    | "Europass"
    | "KybMonoCredential"
    | "KycCredential"
    | "VerifiableMandate"
    | "VerifiablePresentation"
    | "EuropeanBankIdentity"
    | "KybCredential"
    | "VerifiableAttestation"
    | "OpenBadgeCredential"
    | "PeerReview"
    | "DataConsortium"
    | "ProofOfResidence"
    | "AmletCredential"
    | "ParticipantCredential"
    | "PermanentResidentCard"
    | "UniversityDegree"
    | "VerifiableId"
    | "DataServiceOffering"
    | "GaiaxCredential"
    | "Iso27001Certificate"
;

    /*//////////////////////////////////////////////////////////////
                                 CLASSES
    //////////////////////////////////////////////////////////////*/

/* class decorator */
export function staticImplements<T>() {
    return <U extends T>(constructor: U) => {constructor};
}

export class ProofConfig {
    public issuerDid: string;
    public subjectDid: string;
    public proofType?: ProofType;
    public verifierDid?: string;
    public issuerVerificationMethod?: string;
    public domain?:	string;
    public nonce?: string;
    public proofPurpose?: string;
    public credentialId?: string;
    public issueDate?: string;
    public validDate?: string;
    public expirationDate?: string;
    public dataProviderIdentifier?: string;

    constructor(
        issuerDid: string,
        subjectDid: string,
        proofType?: ProofType,
        verifierDid?: string,
        issuerVerificationMethod?: string,
        domain?:	string,
        nonce?: string,
        proofPurpose?: string,
        credentialId?: string,
        issueDate?: string,
        validDate?: string,
        expirationDate?: string,
        dataProviderIdentifier?: string,
    ) {
        this.issuerDid = issuerDid;
        this.subjectDid = subjectDid;
        this.verifierDid = verifierDid;
        this.issuerVerificationMethod = issuerVerificationMethod;
        this.proofType = proofType;
        this.domain = domain;
        this.nonce = nonce;
        this.proofPurpose = proofPurpose;
        this.credentialId = credentialId;
        this.issueDate = issueDate;
        this.validDate = validDate;
        this.expirationDate = expirationDate;
        this.dataProviderIdentifier = dataProviderIdentifier;
    }
}

// MANDATORY:
// - templateId
// - issuerDID (inside config)
// - subjectDID (inside config)
export class IssueCredentialRequest {
    public templateId: string;
    public config: ProofConfig;
    public credentialData?: object;

    constructor(
        templateId: string,
        config: ProofConfig,
        credentialData?: object
    ) {
        this.templateId = templateId;
        this.config = config;
        this.credentialData = credentialData;
    }
}

export class CredentialStatus {
    public id: string;
    public type: CredentialStatusType;

    constructor(id: string, type: CredentialStatusType) {
        this.id = id;
        this.type = type;
    }
}

export class VerificationRequest {
    public policies: any[];
    public credentials: any[];

    constructor(policies: any[], credentials: any[]) {
        this.policies = policies;
        this.credentials = credentials;
    }
}

// https://docs.walt.id/v/ssikit/concepts/verification-policies/dynamic-policies
export class DynamicPolicyArg {
    public name: string;
    public description?: string;
    public input: any;
    public policy: string;
    public dataPath: string;
    public policyQuery: string;
    public policyEngine: PolicyEngineType;
    public applyToVC: boolean;
    public applyToVP: boolean;

    constructor(
        name: string, 
        policyEngine: PolicyEngineType,
        applyToVC: boolean,
        applyToVP: boolean,
        input: any,
        policy: string,
        dataPath: string,
        policyQuery: string,
        description?: string,
    ) {
        this.name = name;
        this.description = description;
        this.input = input;
        this.policy = policy;
        this.dataPath = dataPath;
        this.policyQuery = policyQuery;
        this.policyEngine = policyEngine;
        this.applyToVC = applyToVC;
        this.applyToVP = applyToVP;
    }
}

export class PresentCredentialsRequest {
    public vcs: string[];
    public holderDid: string;
    public verifierDid?: string;
    public domain?: string;
    public challenge?: string;

    constructor(
        vcs: object[],
        holderDid: string,
        verifierDid?: string,
        domain?: string,
        challenge?: string,
    ) {
        // we pass the array of VC objects, then we transform to string for the APIs
        this.vcs = vcs.map(vc => JSON.stringify(vc));
        this.holderDid = holderDid;
        this.verifierDid = verifierDid;
        this.domain = domain;
        this.challenge = challenge;
    }
}

export class PresentCredentialIDsRequest {
    public vcIds: string[];
    public holderDid: string;
    public verifierDid?: string;
    public domain?: string;
    public challenge?: string;

    constructor(
        vcIds: string[],
        holderDid: string,
        verifierDid?: string,
        domain?: string,
        challenge?: string,
    ) {
        this.vcIds = vcIds;
        this.holderDid = holderDid;
        this.verifierDid = verifierDid;
        this.domain = domain;
        this.challenge = challenge;
    }
}

export class EbsiTimestampRequest {
    public did: string;
    public ethDidAlias?: string;
    public data: string;

    constructor(
        did: string,
        data: object,
        ethDidAlias?: string,
    ) {
        this.did = did;
        this.ethDidAlias = ethDidAlias;
        this.data = JSON.stringify(data);
    }
}

    /*//////////////////////////////////////////////////////////////
                                FUNCTIONS
    //////////////////////////////////////////////////////////////*/

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
        if (type === "GET") {
            result = await axios.get(callingUrl, config);
        } else 
        if (type === "POST") {
            result = await axios.post(callingUrl, config);
        } else 
        if (type === "DELETE") {
            result = await axios.delete(callingUrl, config);
        } else
        if (type === "PUT") {
            result = await axios.put(callingUrl, config);
        }
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