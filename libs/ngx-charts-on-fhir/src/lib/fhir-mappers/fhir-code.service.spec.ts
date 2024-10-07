import { TestBed } from '@angular/core/testing';
import { FhirCodeService } from './fhir-code.service';

describe('CodeNameService', () => {
  let service: FhirCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FhirCodeService],
    });
    service = TestBed.inject(FhirCodeService);
  });

  describe('getName', () => {
    it('should return text property', () => {
      expect(service.getName({ text: 'hello' })).toBe('hello');
    });
  });
});
