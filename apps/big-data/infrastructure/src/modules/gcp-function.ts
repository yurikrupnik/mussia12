import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import camelCase from 'lodash/camelCase';
import { GcpFunction } from '../types';

const gcpFunction = (props: GcpFunction) => {
  const {
    name,
    region,
    bucket,
    path,
    member,
    eventTrigger,
    environmentVariables,
  } = props;
  const archive = new gcp.storage.BucketObject(name, {
    name: `${name}.zip`,
    bucket: bucket.name,
    source: new pulumi.asset.FileArchive(`${path}${name}`),
  });

  const func = new gcp.cloudfunctions.Function(name, {
    runtime: 'nodejs16',
    availableMemoryMb: 256,
    sourceArchiveBucket: bucket.name,
    sourceArchiveObject: archive.name,
    triggerHttp: eventTrigger ? null : true,
    eventTrigger: eventTrigger ? eventTrigger : null,
    entryPoint: camelCase(name),
    name: name,
    region,
    environmentVariables,
    // serviceAccountEmail: '',
  });

  let invoker;
  if (member) {
    invoker = new gcp.cloudfunctions.FunctionIamMember(`${name}-invoker`, {
      project: func.project,
      region: func.region,
      cloudFunction: func.name,
      role: 'roles/cloudfunctions.invoker',
      member,
    });
  }

  return {
    url: func.httpsTriggerUrl,
    invoker,
  };
};

export const createGcpFunctions = (list: GcpFunction[]) =>
  list.map(gcpFunction);

export class GcpFunctionResource extends pulumi.ComponentResource {
  constructor(
    name: string,
    gcpFunction: GcpFunction,
    opts?: pulumi.ResourceOptions
  ) {
    super('mussia8:utils:function:', name, {}, opts);
    const { region, bucket, path, member, eventTrigger, environmentVariables } =
      gcpFunction;
    const archive = new gcp.storage.BucketObject(
      name,
      {
        name: `${name}.zip`,
        bucket: bucket.name,
        source: new pulumi.asset.FileArchive(`${path}${name}`),
      },
      { parent: this }
    );

    const func = new gcp.cloudfunctions.Function(
      name,
      {
        runtime: 'nodejs16',
        availableMemoryMb: 256,
        sourceArchiveBucket: bucket.name,
        sourceArchiveObject: archive.name,
        triggerHttp: eventTrigger ? null : true,
        eventTrigger: eventTrigger ? eventTrigger : null,
        entryPoint: camelCase(name),
        name: name,
        region,
        environmentVariables,
        // serviceAccountEmail: '',
      },
      { parent: this }
    );

    if (member) {
      new gcp.cloudfunctions.FunctionIamMember(
        `${name}-invoker`,
        {
          project: func.project,
          region: func.region,
          cloudFunction: func.name,
          role: 'roles/cloudfunctions.invoker',
          member,
        },
        { parent: this }
      );
    }
  }
}
