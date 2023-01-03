import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Bundle, MedicationRequest } from 'fhir/r4';
import { FhirDataService } from './fhir-data.service';

describe('postService (HttpClientTestingModule)', () => {
  let fhirdataService: FhirDataService;
  let httpTestingController: HttpTestingController;
  let medicationBundle: Bundle<MedicationRequest> = {
    resourceType: 'Bundle',
    type: 'searchset',
    entry: [
      {
        resource: {
          resourceType: 'MedicationRequest',
          id: '173531',
          intent: 'order',
          status: 'completed',
          subject: {},
        },
      },
      {
        resource: {
          resourceType: 'MedicationRequest',
          id: '173532',
          intent: 'order',
          status: 'completed',
          subject: {},
        },
      },
    ],
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FhirDataService],
      imports: [HttpClientTestingModule],
    });

    fhirdataService = TestBed.inject(FhirDataService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe('getMedicationRequests()', () => {
    it('should return medication bundle when getMedicationRequests() is called', (done: DoneFn) => {
      fhirdataService.getMedicationRequests().subscribe((data) => {
        expect(data).toEqual(medicationBundle);
        done();
      });

      const request = httpTestingController.expectOne(fhirdataService.url);
      request.flush(medicationBundle);
      expect(request.request.method).toBe('GET');
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
