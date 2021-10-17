import { mongoConfig } from './shared-configs';

describe('sharedConfigs', () => {
  it('should work', () => {
    expect(mongoConfig().MONGO_URI).toEqual('mongodb://localhost/mussia12');
  });
});
