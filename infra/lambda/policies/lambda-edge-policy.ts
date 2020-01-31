import { iam } from '@pulumi/aws';

const policy: iam.PolicyDocument = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Principal: {
        Service: ['lambda.amazonaws.com', 'edgelambda.amazonaws.com'],
      },
      Action: 'sts:AssumeRole',
    },
  ],
};

export const lambdaEdgePolicy = JSON.stringify(policy);
