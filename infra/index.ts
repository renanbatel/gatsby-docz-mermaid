import { cloudfront, lambda, s3 } from '@pulumi/aws';
import { all, asset } from '@pulumi/pulumi';

import { contentDistributionArgs } from './cloudfront';
import { config } from './config';
import { authLambdaRole } from './lambda';
import { cloudfrontAccessBucketPolicy } from './policies';
import { addSuffix, folderUpload } from './utils';

// Cloudfront Origin Access Identity
const originAccessIdentity = new cloudfront.OriginAccessIdentity(addSuffix(config.site.name, 'origin-access-indentity'));

// Site Content S3 Bucket
const contentBucket = new s3.Bucket(addSuffix(config.site.name, 'content'), {
  website: { indexDocument: 'index.html' },
});

// Request logs bucket
const logBucket = config.site.logRequests ? new s3.Bucket(addSuffix(config.site.name, 'request-logs'), { acl: 'private' }) : undefined;

// Site Content S3 Bucket Access Policy for Cloudfront
const contentBucketPolicy = new s3.BucketPolicy(addSuffix(config.site.name, 'policy'), {
  bucket: contentBucket.bucket,
  policy: all([contentBucket.bucket, originAccessIdentity.id]).apply(cloudfrontAccessBucketPolicy),
});

// Authentication Lambda Function for Cloudfront Lambda@Edge
const authLambdaFunction = new lambda.Function(addSuffix(config.site.name, 'auth-lambda-function'), {
  code: new asset.FileArchive(`${config.lambda.buildDir}/auth.zip`),
  handler: 'auth.handler',
  role: authLambdaRole.arn,
  runtime: lambda.NodeJS10dXRuntime,
});

folderUpload(config.site.dir, contentBucket);

// Cloudfront Distribution (CDN)
// ! There's a bug on AWS that doesn't permit the lambda association setup on Cloudfront, it has to be done manually for now
// Ref: https://forums.aws.amazon.com/thread.jspa?messageID=925495
const cloudfrontDistribution = new cloudfront.Distribution(
  addSuffix(config.site.name, 'content-distribution'),
  contentDistributionArgs(contentBucket, originAccessIdentity, logBucket /* , authLambdaFunction */),
);

export const contentBucketName = contentBucket.bucket;
export const contentBucketOrigin = contentBucket.websiteEndpoint;
export const cloudfrontDistributionUrl = cloudfrontDistribution.domainName;
