import {
    VerificationRequest, DynamicPolicyArg,
} from '../core/utils';

export interface IAuditor {
    
    getVerificationPolicies(): Promise<any>;
    verifyCredential(request: VerificationRequest): Promise<any>;
    
    createDynamicVerificationPolicy(
        name: string, 
        arg: DynamicPolicyArg,
        update?: boolean, 
        downloadPolicy?: boolean
    ): Promise<DynamicPolicyArg>;

    deleteDynamicVerificationPolicy(name: string): Promise<void>; 

}