import { TestBed, waitForAsync } from '@angular/core/testing';
import { FhirDataService } from './fhir-data.service';
import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { ReportBPComponent } from 'projects/cardiovascular-patient-app/src/app/report-bp/report-bp.component';

const bloodPressure = { systolic: 89, diastolic: 63 }

describe('FhirDataService', () => {
  let service: FhirDataService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [{ provide: ReportBPComponent, useValue: bloodPressure }]
    });
    service = TestBed.inject(FhirDataService);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  describe('initialize', () => {
    it('should create a client from EHR launch context', async () => {
      await FHIR.oauth2.authorize({
        fhirServiceUrl: 'http://example.com/ehr',
        completeInTarget: true,
        noRedirect: true,
        fakeTokenResponse: {
          serverUrl: 'http://example.com/ehr',
        },
      });
      await service.initialize();
      expect(service.client?.getState('serverUrl')).toEqual('http://example.com/ehr');
    });

    it('should create a client from clientState parameter when there is no EHR launch context', async () => {
      await service.initialize({
        serverUrl: 'http://example.com/open',
      });
      expect(service.client?.getState('serverUrl')).toEqual('http://example.com/open');
    });
  });

  describe('getPatientData', () => {
    beforeEach(async () => {
      await service.initialize({
        serverUrl: 'http://example.com/open',
        tokenResponse: {
          patient: '123',
        },
      });
      if (!service.client) {
        throw new Error('Client should be initialized');
      }
    });

    it('should query the FHIR server on subscribe', waitForAsync(() => {
      const request = spyOn(service.client!.patient, 'request').and.resolveTo(null);
      const bundles$ = service.getPatientData('Observation');
      bundles$.subscribe({
        complete: () => {
          expect(request).toHaveBeenCalledWith(jasmine.stringMatching(/^Observation/), jasmine.anything());
        },
      });
    }));

    it('should throw an error on request failure', waitForAsync(() => {
      spyOn(service.client!.patient, 'request').and.rejectWith('error');
      const bundles$ = service.getPatientData('Observation');
      bundles$.subscribe({
        complete: () => fail(),
        error: (error) => {
          expect(error).toEqual('error');
        },
      });
    }));

    it('should emit a bundle when each page of results is retrieved', waitForAsync(() => {
      let onPage: NonNullable<fhirclient.FhirOptions['onPage']> = () => {
        throw new Error('onPage callback should be passed to Client.patient.request()');
      };
      spyOn(service.client!.patient, 'request').and.callFake((_requestOptions, fhirOptions) => {
        onPage = fhirOptions?.onPage ?? onPage;
        return Promise.resolve<any>(null);
      });
      const a = { bundle: 1 };
      const b = { bundle: 2 };
      getTestScheduler().schedule(() => onPage(a), 10);
      getTestScheduler().schedule(() => onPage(b), 30);
      const bundles$ = service.getPatientData('Observation');
      expect(bundles$).toBeObservable(cold('-a-b', { a, b }));
    }));

    it('should stop retrieving results when unsubscribed', waitForAsync(() => {
      let onPage: NonNullable<fhirclient.FhirOptions['onPage']> = () => {
        throw new Error('onPage callback should be passed to Client.patient.request()');
      };
      spyOn(service.client!.patient, 'request').and.callFake((_requestOptions, fhirOptions) => {
        onPage = fhirOptions?.onPage ?? onPage;
        return Promise.resolve<any>(null);
      });
      const bundles$ = service.getPatientData('Observation');
      bundles$.subscribe().unsubscribe();
      expect(() => onPage({})).toThrowError();
    }));
  });

  it('shold create a fhir resource for add Blood Pressure', async () => {
    const resource = service.createResourceData(bloodPressure);
    if (resource.component) {
      const diastolicBP = resource.component[0].valueQuantity?.value;
      const systolicBP = resource.component[1].valueQuantity?.value;
      expect(diastolicBP).toEqual(bloodPressure.diastolic)
      expect(systolicBP).toEqual(bloodPressure.systolic)
    }
  })

});
