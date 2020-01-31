import { s3 } from '@pulumi/aws';
import * as mime from 'mime';

import { crawlDirectory } from './crawl-directory';

export function folderUpload(dir: string, bucket: s3.Bucket): void {
  crawlDirectory(dir, (filePath) => {
    const relativeFilePath = filePath.replace(`${dir}/`, '');
    const object = new s3.BucketObject(relativeFilePath, {
      key: relativeFilePath,
      bucket: bucket,
      source: filePath,
      contentType: mime.getType(filePath) || undefined,
    });
  });
}
