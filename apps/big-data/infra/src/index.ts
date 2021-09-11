import * as gcp from '@pulumi/gcp';

export function storage(location: string) {
  const tempFolder = new gcp.storage.Bucket('temp-folder', {
    location,
    forceDestroy: true,
  });

  const functions = new gcp.storage.Bucket('big-data-functions', {
    location,
    forceDestroy: true,
  });

  const beEvents = new gcp.storage.Bucket('be-events', {
    location,
    forceDestroy: true,
  });

  const agentsEvents = new gcp.storage.Bucket('agents-events', {
    location,
    forceDestroy: true,
  });

  const coreEvents = new gcp.storage.Bucket('core-events', {
    location,
    forceDestroy: true,
  });
  return {
    tempFolder,
    functions,
    beEvents,
    agentsEvents,
    coreEvents,
  };
}
