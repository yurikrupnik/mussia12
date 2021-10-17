import { getData } from './shared-object-utils';
import faker from 'faker'

describe('sharedObjectUtils', () => {
  it('should work', () => {
    const data = {
      name: faker.name.findName(),
      email: faker.internet.email()
    }
    expect(getData({data})).toEqual(data);
  });
});
