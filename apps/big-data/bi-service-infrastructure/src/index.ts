import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import * as path from 'path';
// This is the path to the other project relative to the CWD
import {GcpFunctionResource, GcpFunction} from '@mussia12/pulumi-gcp'

const functionsPath = '../../../dist/apps/big-data/';

const projectRoot = '../big-data-bi-service';

const config = new pulumi.Config();

const region = config.get('region') || 'europe-west1';
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

// const funcs = createGcpFunctions(functions);
const funcs = functions.map((f) => {
  return new GcpFunctionResource(f.name, f);
});
