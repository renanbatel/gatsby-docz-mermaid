import { s3 } from '@pulumi/aws';
import { asset } from '@pulumi/pulumi';
import * as mime from 'mime';
import { resolve } from 'path';

import { bucketPublicReadPolicy } from './policies';
import { crawlDirectory } from './utils';

const siteBucket = new s3.Bucket('docz-app-gatsby', {
  website: { indexDocument: 'index.html' },
});
const siteBucketPolicy = new s3.BucketPolicy('docz-app-gatsby-policy', {
  bucket: siteBucket.bucket,
  policy: siteBucket.bucket.apply(bucketPublicReadPolicy),
});
const siteDir = resolve('../public');

crawlDirectory(siteDir, (filePath) => {
  const relativeFilePath = filePath.replace(`${siteDir}/`, '');
  const object = new s3.BucketObject(relativeFilePath, {
    key: relativeFilePath,
    bucket: siteBucket,
    source: new asset.FileAsset(filePath),
    contentType: mime.getType(filePath) || undefined,
  });
});

export const bucketName = siteBucket.bucket;
export const websiteUrl = siteBucket.websiteEndpoint;
