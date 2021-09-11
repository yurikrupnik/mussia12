// Todo not to use pulumi in nx repo - adds pulumi as dep to docker image

import * as pulumi from '@pulumi/pulumi';
import * as docker from '@pulumi/docker';
import * as gcp from '@pulumi/gcp';

const service = 'projects-api';

const myImage = new docker.Image(service, {
  imageName: pulumi.interpolate`eu.gcr.io/${gcp.config.project}/${service}:latest`,
  build: {
    context: `../apps/fullstack/${service}`,
  },
});

const serv = new gcp.cloudrun.Service(
  service,
  {
    location: 'europe-west1',
    name: service,
    template: {
      spec: {
        containers: [
          {
            image: myImage.imageName,
          },
        ],
      },
    },
  },
  { dependsOn: myImage }
);
new gcp.cloudrun.IamMember('hello-everyone', {
  service: serv.name,
  location: 'europe-west1',
  role: 'roles/run.invoker',
  member: 'allUsers',
});
