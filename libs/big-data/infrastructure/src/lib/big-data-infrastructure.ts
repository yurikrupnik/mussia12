import * as gcp from '@pulumi/gcp';

export function bigDataInfrastructure(location: string) {
  return new gcp.storage.Bucket('temp-folder', {
    location,
    forceDestroy: true,
  });
}
