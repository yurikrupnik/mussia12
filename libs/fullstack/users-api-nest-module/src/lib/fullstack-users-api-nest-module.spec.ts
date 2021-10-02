import { fullstackUsersApiNestModule } from './fullstack-users-api-nest-module';

describe('fullstackUsersApiNestModule', () => {
  it('should work', () => {
    expect(fullstackUsersApiNestModule()).toEqual(
      'fullstack-users-api-nest-module'
    );
  });
});
