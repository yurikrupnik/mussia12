import * as gcp from '@pulumi/gcp';

export function creteSomething(location: string) {
  return new gcp.storage.Bucket('temp-folder', {
    location,
    forceDestroy: true,
  });
}

export function bigDataInfrastructure(): string {
  return 'big-data-infrastructure';
}
