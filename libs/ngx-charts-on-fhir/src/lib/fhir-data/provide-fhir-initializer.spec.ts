import { MockBuilder, MockProvider, ngMocks } from 'ng-mocks';
import { provideFhirInitializer } from './provide-fhir-initializer';
import { FhirDataService } from './fhir-data.service';

describe('provideFhirInitializer', () => {
  beforeEach(async () => {
    await MockBuilder().provide([
      provideFhirInitializer(),
      MockProvider(FhirDataService, {
        initialize: jest.fn(),
      }),
    ]);
  });
  it('should initialize the FHIR client', async () => {
    await MockBuilder().provide([
      provideFhirInitializer(),
      MockProvider(FhirDataService, {
        initialize: jest.fn(),
      }),
    ]);
    const fhir = ngMocks.get(FhirDataService);
    sessionStorage.setItem('SMART_KEY', 'xyz');
    expect(fhir.initialize).toHaveBeenCalled();
  });
});
