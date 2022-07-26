import {
    IssueCredentialRequest, VCTemplate,
} from '../core/utils';

export interface ISignatory {

    issueCredential(request: IssueCredentialRequest): Promise<any>;

    getVCTemplates(): Promise<any>;
    getVCTemplate(templateId: VCTemplate): Promise<any>;

    isRevoked(publicRevocationToken: string): Promise<any>;
    revokeCredential(privateRevocationToken: string): Promise<void>;

}