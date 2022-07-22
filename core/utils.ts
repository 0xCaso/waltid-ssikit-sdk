import axios from 'axios';

type Call = "GET" | "POST" | "DELETE" | "PUT";
type Port = 7000 | 7001 | 7002 | 7003 | 7004;

export const apiPortCore: Port = 7000;
export const apiPortSignatory: Port = 7001;
export const apiPortCustodian: Port = 7002;
export const apiPortAuditor: Port = 7003;
export const apiPortESSIF: Port = 7004;

// THESE TYPES ARE BASED ON WALT.ID SSI KIT
export type KeyAlgorithm = "RSA" | "EdDSA_Ed25519" | "ECDSA_Secp256k1";
export type KeyFormat = "JWK" | "PEM";
export type DIDMethod = "key" | "did" | "ebsi";
export type ProofType = undefined | "JWT" | "LD_PROOF";
export type VCTemplate =
    "DataSelfDescription" |
    "VerifiableDiploma" |
    "VerifiableVaccinationCertificate" |
    "LegalPerson" |
    "VerifiableAuthorization" |
    "Europass" |
    "KybMonoCredential" |
    "KycCredential" |
    "VerifiableMandate" |
    "VerifiablePresentation" |
    "EuropeanBankIdentity" |
    "KybCredential" |
    "VerifiableAttestation" |
    "OpenBadgeCredential" |
    "PeerReview" |
    "DataConsortium" |
    "ProofOfResidence" |
    "AmletCredential" |
    "ParticipantCredential" |
    "PermanentResidentCard" |
    "UniversityDegree" |
    "VerifiableId" |
    "DataServiceOffering" |
    "GaiaxCredential" |
    "Iso27001Certificate"
;

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
    try {
        if (type === "GET") {
            result = await axios.get(`http://0.0.0.0:${port}${url}`, config);
        } else 
        if (type === "POST") {
            result = await axios.post(`http://0.0.0.0:${port}${url}`, config);
        } else 
        if (type === "DELETE") {
            result = await axios.delete(`http://0.0.0.0:${port}${url}`, config);
        } else
        if (type === "PUT") {
            result = await axios.put(`http://0.0.0.0:${port}${url}`, config);
        }
        return result
    } catch(err: any) {
        // console.log(err.response.data)
        return ""
    }
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
        dataProviderIdentifier?: string
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
// - proofType (inside config)
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