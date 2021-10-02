import { sharedConfigs } from './shared-configs';

describe('sharedConfigs', () => {
  it('should work', () => {
    expect(sharedConfigs()).toEqual('shared-configs');
  });
});
