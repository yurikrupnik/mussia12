import { fullstackProjectsApiNestModule } from './fullstack-projects-api-nest-module';

describe('fullstackProjectsApiNestModule', () => {
  it('should work', () => {
    expect(fullstackProjectsApiNestModule()).toEqual(
      'fullstack-projects-api-nest-module'
    );
  });
});
