import { Config } from '@pulumi/pulumi';
import { resolve } from 'path';

const awsConfig = new Config('aws');
const siteConfig = new Config('site');

export const config = {
  aws: {
    region: awsConfig.require('region'),
  },
  lambda: {
    buildDir: resolve('lambda/build'),
  },
  site: {
    dir: resolve('..', siteConfig.require('dir')),
    name: siteConfig.require('name'),
    logRequests: siteConfig.require('log-requests'),
  },
};
