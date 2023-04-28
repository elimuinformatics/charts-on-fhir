import { TestBed } from '@angular/core/testing';
import { FhirCodeService } from './fhir-code.service';

describe('CodeNameService', () => {
  let service: FhirCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FhirCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
