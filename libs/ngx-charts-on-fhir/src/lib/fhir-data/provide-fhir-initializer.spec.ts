import { TestBed } from '@angular/core/testing';
import { provideFhirInitializer } from './provide-fhir-initializer';
import { FhirDataService } from './fhir-data.service';

describe('provideFhirInitializer', () => {
  let fhirDataService: FhirDataService;
  const environment = {
    clienState: {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideFhirInitializer(environment),
        {
          provide: FhirDataService,
          useValue: jasmine.createSpyObj('FhirDataService', ['initialize']),
        },
      ],
    }).compileComponents();

    // Inject the FhirDataService after setting up the TestBed
    fhirDataService = TestBed.inject(FhirDataService);
  });

  it('should initialize the FHIR client', () => {
    // Simulate setting sessionStorage item
    sessionStorage.setItem('SMART_KEY', 'xyz');

    // Check if the initialize method has been called
    expect(fhirDataService.initialize).toHaveBeenCalled();
  });
});
