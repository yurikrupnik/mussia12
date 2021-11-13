/* eslint-disable @typescript-eslint/no-var-requires */
const tsConfig = require('./tsconfig.json');
const tsConfigPaths = require('tsconfig-paths');
tsConfigPaths.register({
  baseUrl: tsConfig.compilerOptions.baseUrl,
  paths: tsConfig.compilerOptions.paths,
});

import * as pulumi from '@pulumi/pulumi';
// import * as aws from '@pulumi/aws';
import * as path from 'path';
import * as gcp from '@pulumi/gcp';
import { GcpFunction, GcpFunctionResource } from '@mussia12/pulumi-gcp';

// This is the path to the other project relative to the CWD
const projectRoot = '../big-data-bi-service';
const config = new pulumi.Config();

const region = config.get('region') || 'europe-west1';
const functionsPath = '../../../dist/apps/big-data/';
const project = config.get('project') || 'mussia8';

const funcBucket = new gcp.storage.Bucket(`${project}-func-bucket`, {
  name: `${project}-func-bucket`,
  location: region,
  forceDestroy: true,
  labels: {
    type: 'code',
    team: 'big-data',
  },
});
const functions: GcpFunction[] = [
  {
    name: 'publish-topic',
    region,
    bucket: funcBucket,
    path: functionsPath,
    member: 'allUsers',
  },
];

const funcs = functions.map((f) => {
  return new GcpFunctionResource(f.name, f);
});
