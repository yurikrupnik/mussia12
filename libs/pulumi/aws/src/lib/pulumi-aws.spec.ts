import { pulumiAws } from './pulumi-aws';

describe('pulumiAws', () => {
  it('should work', () => {
    expect(pulumiAws()).toEqual('pulumi-aws');
  });
});
