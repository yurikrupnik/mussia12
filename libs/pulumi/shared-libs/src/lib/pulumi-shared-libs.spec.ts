import { pulumiSharedLibs } from './pulumi-shared-libs';

describe('pulumiSharedLibs', () => {
  it('should work', () => {
    expect(pulumiSharedLibs()).toEqual('pulumi-shared-libs');
  });
});
