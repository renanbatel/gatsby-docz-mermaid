import { iam } from '@pulumi/aws';

import { config } from '../../config';
import { addSuffix } from '../../utils';
import { lambdaEdgePolicy } from '../policies';

export const authLambdaRole = new iam.Role(addSuffix(config.site.name, 'lambda-auth-role'), {
  assumeRolePolicy: lambdaEdgePolicy,
});

export const authLambdaRoleAttachment = new iam.RolePolicyAttachment(addSuffix(config.site.name, 'lambda-auth-role-attachment'), {
  role: authLambdaRole,
  policyArn: iam.ManagedPolicies.AWSLambdaExecute,
});
