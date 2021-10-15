import * as docker from '@pulumi/docker';
import { ImageArgs } from '@pulumi/docker';
import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import { ServiceArgs } from '@pulumi/gcp/cloudrun';

export interface GcpService {
  // name: string;
  serviceArgs: ServiceArgs;
  // imageArgs: ImageArgs;
  serviceFolder: string;
}

const project = gcp.organizations.getProject({});

const secret = new gcp.secretmanager.Secret('secret', {
  secretId: 'secret',
  replication: {
    automatic: true,
  },
});

const secret_version_data = new gcp.secretmanager.SecretVersion(
  'secret-version-data',
  {
    secret: secret.name,
    secretData: 'secret-data',
  }
);

const secret_access = new gcp.secretmanager.SecretIamMember(
  'secret-access',
  {
    secretId: secret.id,
    role: 'roles/secretmanager.secretAccessor',
    member: project.then(
      (project) =>
        `serviceAccount:${project.number}-compute@developer.gserviceaccount.com`
    ),
  },
  {
    dependsOn: [secret],
  }
);

export class GcpCloudRunResource extends pulumi.ComponentResource {
  constructor(
    name: string,
    gcpService: GcpService,
    opts?: pulumi.ResourceOptions
  ) {
    super('mussia8:utils:cloudrun:', name, {}, opts);

    const { serviceArgs, serviceFolder } = gcpService;
    const { location } = serviceArgs;

    const myImage = new docker.Image(
      name,
      {
        imageName: pulumi.interpolate`eu.gcr.io/${gcp.config.project}/${name}:latest`,
        build: {
          context: `${serviceFolder}/${name}`,
        },
      },
      { parent: this }
    );
    const serv = new gcp.cloudrun.Service(
      'aris-test',
      {
        ...serviceArgs,
        template: {
          spec: {
            // serviceAccountName
            containers: [
              {
                image: myImage.imageName,
                envs: [
                  {
                    name: 'MONGO_URI',
                    value:
                      'mongodb+srv://yurikrupnik:T4eXKj1RBI4VnszC@cluster0.rdmew.mongodb.net/',
                  },
                  {
                    name: 'TARGET',
                    value: 'home',
                  },
                ],
              },
            ],
          },
        },
      },
      { dependsOn: myImage, parent: this }
    );

    const admin = gcp.organizations.getIAMPolicy(
      {
        bindings: [
          {
            role: 'roles/viewer',
            members: ['user:krupnik.yuri@gmail.com'],
          },
          {
            role: 'roles/run.invoker',
            members: ['allUsers'],
          },
        ],
      },
      { parent: this }
    );
    const policy = new gcp.cloudrun.IamPolicy(
      'policy',
      {
        location: serv.location,
        project: serv.project,
        service: serv.name,
        policyData: admin.then((admin) => admin.policyData),
      },
      { parent: this }
    );

    // const role = new gcp.cloudrun.IamMember(
    //   `${name}-member`,
    //   {
    //     service: serv.name,
    //     location,
    //     role: 'roles/run.invoker',
    //     member: 'allUsers',
    //   },
    //   { parent: this }
    // );
    //
    // const s = new gcp.cloudrun.IamBinding(
    //   'binding',
    //   {
    //     location,
    //     role: 'roles/viewer',
    //     service: serv.name,
    //     members: ['user:krupnik.yuri@gmail.com'],
    //   },
    //   { parent: this }
    // );
    //
    // const ss = new gcp.cloudrun.IamBinding(
    //   'binding1',
    //   {
    //     location,
    //     role: 'roles/pubsub.publisher',
    //     service: serv.name,
    //     members: ['user:krupnik.yuri@gmail.com'],
    //   },
    //   { parent: this }
    // );
  }
}
