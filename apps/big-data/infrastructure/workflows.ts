import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';

const testAccount = new gcp.serviceaccount.Account('testAccount', {
  accountId: 'my-account',
  displayName: 'Test Service Account',
});
const example = new gcp.workflows.Workflow('example', {
  region: 'us-central1',
  description: 'Magic',
  serviceAccount: testAccount.id,
  sourceContents: `# This is a sample workflow, feel free to replace it with your source code
#
# This workflow does the following:
# - reads current time and date information from an external API and stores
#   the response in CurrentDateTime variable
# - retrieves a list of Wikipedia articles related to the day of the week
#   from CurrentDateTime
# - returns the list of articles as an output of the workflow
# FYI, In terraform you need to escape the $$ or it will cause errors.

- getCurrentTime:
    call: http.get
    args:
        url: https://us-central1-workflowsample.cloudfunctions.net/datetime
    result: CurrentDateTime
`,
});

function getWorkflow() {
  return `# This is a sample workflow, feel free to replace it with your source code
#
# This workflow does the following:
# - reads current time and date information from an external API and stores
#   the response in CurrentDateTime variable
# - retrieves a list of Wikipedia articles related to the day of the week
#   from CurrentDateTime
# - returns the list of articles as an output of the workflow
# FYI, In terraform you need to escape the $$ or it will cause errors.

- getCurrentTime:
    call: http.get
    args:
        url: https://us-central1-workflowsample.cloudfunctions.net/datetime
    result: CurrentDateTime
`;
}
