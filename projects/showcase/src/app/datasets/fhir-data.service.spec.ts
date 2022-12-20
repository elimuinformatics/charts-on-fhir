import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Bundle, MedicationOrder } from 'fhir/r2';
import { FhirDataService } from './fhir-data.service';

describe('postService (HttpClientTestingModule)', () => {
  let fhirdataService: FhirDataService;
  let httpTestingController: HttpTestingController;
  let medicationBundle: Bundle<MedicationOrder> = {
    resourceType: 'Bundle',
    id: 'f3772a8e-591d-4d9b-a985-0b29fbd92522',
    type: 'searchset',
    total: 2,

    entry: [
      {
        resource: {
          resourceType: 'MedicationOrder',
          id: '173531',
        },
      },
      {
        resource: {
          resourceType: 'MedicationOrder',
          id: '173532',
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

  describe('getMedicationsOrder()', () => {
    it('should return medication bundle when getMedicationsOrder() is called', (done: DoneFn) => {
      fhirdataService.getMedicationsOrder().subscribe((data) => {
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
