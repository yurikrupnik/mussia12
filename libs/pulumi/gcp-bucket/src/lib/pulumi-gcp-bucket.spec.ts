import { pulumiGcpBucket } from './pulumi-gcp-bucket';

describe('pulumiGcpBucket', () => {
  it('should work', () => {
    expect(pulumiGcpBucket()).toEqual('pulumi-gcp-bucket');
  });
});
