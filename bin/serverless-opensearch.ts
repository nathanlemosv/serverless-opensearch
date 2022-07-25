#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ServerlessOpensearchStack } from '../lib/serverless-opensearch-stack';

const app = new cdk.App();

new ServerlessOpensearchStack(app, 'serverless-opensearch-stack', {
  env: {
    region: 'us-east-1',
    account: process.env.AWS_ACCOUNT_ID
  }
});