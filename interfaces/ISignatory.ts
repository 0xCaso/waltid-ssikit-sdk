import {
    IssueCredentialRequest,
} from '../core/utils';

export interface ISignatory {

    issueCredential(request: IssueCredentialRequest): Promise<any>;

    getVCTemplateIDs(): Promise<Array<string>>;
    getVCTemplate(templateId: string): Promise<any>;

    isRevoked(publicRevocationToken: string): Promise<any>;
    revokeCredential(privateRevocationToken: string): Promise<boolean>;

}