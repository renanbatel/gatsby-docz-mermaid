import { cloudfront, /* lambda, */ s3 } from '@pulumi/aws';

function originAccessIdentityPath(originAccessIdentityId: string): string {
  return `origin-access-identity/cloudfront/${originAccessIdentityId}`;
}

// function versionLambdaArn(lambdaFunctionArn: string): string {
//   return `${lambdaFunctionArn}:1`;
// }

export function contentDistributionArgs(
  contentBucket: s3.Bucket,
  originAccessIdentity: cloudfront.OriginAccessIdentity,
  logBucket?: s3.Bucket,
  /* lambdaFunction: lambda.Function, */
): cloudfront.DistributionArgs {
  const distributionArgs: cloudfront.DistributionArgs = {
    enabled: true,
    origins: [
      {
        originId: contentBucket.arn,
        domainName: contentBucket.bucketRegionalDomainName,
        s3OriginConfig: {
          originAccessIdentity: originAccessIdentity.id.apply(originAccessIdentityPath),
        },
      },
    ],
    defaultRootObject: 'index.html',
    defaultCacheBehavior: {
      targetOriginId: contentBucket.arn,
      viewerProtocolPolicy: 'allow-all',
      allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
      cachedMethods: ['GET', 'HEAD', 'OPTIONS'],
      forwardedValues: {
        cookies: { forward: 'none' },
        queryString: false,
      },
      minTtl: 0,
      defaultTtl: 600,
      maxTtl: 600,
      // lambdaFunctionAssociations: [
      //   {
      //     eventType: 'viewer-request',
      //     lambdaArn: lambdaFunction.arn.apply(versionLambdaArn),
      //     includeBody: true,
      //   },
      // ],
    },
    priceClass: 'PriceClass_100',
    restrictions: {
      geoRestriction: {
        restrictionType: 'none',
      },
    },
    viewerCertificate: {
      cloudfrontDefaultCertificate: true,
    },
  };

  if (logBucket) {
    const loggingConfig: Partial<cloudfront.DistributionArgs> = {
      loggingConfig: {
        bucket: logBucket.bucketDomainName,
        includeCookies: true,
      },
    };

    return {
      ...distributionArgs,
      ...loggingConfig,
    };
  }

  return distributionArgs;
}
