import {
    VerificationRequest, DynamicPolicyArg,
} from '../core/utils';

export interface IAuditor {
    
    getVerificationPolicies(): Promise<Array<any>>;
    verifyCredential(request: VerificationRequest): Promise<any>;
    
    createDynamicVerificationPolicy(
        name: string, 
        arg: DynamicPolicyArg,
        update?: boolean, 
        downloadPolicy?: boolean
    ): Promise<boolean>;

    deleteDynamicVerificationPolicy(name: string): Promise<boolean>; 

}