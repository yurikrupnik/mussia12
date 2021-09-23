// todo service
// const services = ['bi-service'];
// const project1 = gcp.organizations.getProject({});
//
// const secret = new gcp.secretmanager.Secret(
//   'secret',
//   {
//     secretId: 'secret11',
//     replication: {
//       automatic: true,
//     },
//   },
//   {
//     // provider: google_beta,
//   }
// );
//
// const secret_version_data = new gcp.secretmanager.SecretVersion(
//   'secret-version-data',
//   {
//     secret: secret.name,
//     secretData:
//       'mongodb+srv://yurikrupnik:T4eXKj1RBI4VnszC@cluster0.rdmew.mongodb.net/',
//   },
//   {
//     // provider: google_beta,
//   }
// );
// const secret_access = new gcp.secretmanager.SecretIamMember(
//   'secret-access',
//   {
//     secretId: secret.id,
//     role: 'roles/secretmanager.secretAccessor',
//     member: project1.then(
//       (project) =>
//         `serviceAccount:${project.number}-compute@developer.gserviceaccount.com`
//     ),
//   },
//   {
//     // provider: google_beta,
//     dependsOn: [secret],
//   }
// );
