import { TestBed } from '@angular/core/testing';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { FhirDataService } from '../fhir-data/fhir-data.service';
import { PatientService } from './patient.service';

class MockClient {
  getPatientId() {
    return '0';
  }
}

describe('PatientService', () => {
  let fhir: jasmine.SpyObj<FhirDataService>;

  describe('given a SMART launch context', () => {
    beforeEach(() => {
      fhir = jasmine.createSpyObj<FhirDataService>('FhirDataService', ['getPatientData', 'changePatient'], {
        isSmartLaunch: true,
        client: new MockClient() as any,
      });
      TestBed.configureTestingModule({
        providers: [PatientService, { provide: FhirDataService, useValue: fhir }],
      });
    });

    describe('patients$', () => {
      it('should not retrieve patient list', () => {
        let service = TestBed.inject(PatientService);
        service.patients$.subscribe();
        expect(fhir.getPatientData).not.toHaveBeenCalled();
      });
    });

    describe('selectedPatient$', () => {
      it('should emit patient ID from launch context', () => {
        let service = TestBed.inject(PatientService);
        expect(service.selectedPatient$).toBeObservable(cold('a', { a: '0' }));
      });
    });
  });

  describe('given an open FHIR server', () => {
    beforeEach(() => {
      fhir = jasmine.createSpyObj<FhirDataService>('FhirDataService', ['getPatientData', 'changePatient'], {
        isSmartLaunch: false,
        client: new MockClient() as any,
      });
      fhir.getPatientData.and.returnValue(cold('a', { a: {} }));
      TestBed.configureTestingModule({
        providers: [PatientService, { provide: FhirDataService, useValue: fhir }],
      });
    });

    describe('patients$', () => {
      it('should emit patient list', () => {
        const bundle = {
          entry: [
            {
              resource: {
                id: '1',
                name: [
                  {
                    family: 'Patient',
                    given: ['John', 'Q'],
                  },
                ],
              },
            },
            {
              resource: {
                id: '2',
                name: [
                  {
                    family: 'Person',
                    given: ['Jane'],
                  },
                ],
              },
            },
          ],
        };
        const expected = [
          { id: '1', name: 'John Q Patient' },
          { id: '2', name: 'Jane Person' },
        ];
        fhir.getPatientData.and.returnValue(cold('a', { a: bundle }));
        let service = TestBed.inject(PatientService);
        expect(service.patients$).toBeObservable(cold('x', { x: expected }));
      });

      it('should only query the patient list once', () => {
        let service = TestBed.inject(PatientService);
        service.patients$.subscribe();
        service.patients$.subscribe();
        expect(fhir.getPatientData).toHaveBeenCalledTimes(1);
      });
    });

    describe('selectPatient', () => {
      it('should call changePatient', () => {
        let service = TestBed.inject(PatientService);
        service.selectPatient('1');
        expect(fhir.changePatient).toHaveBeenCalledWith('1');
      });

      it('should emit new selectedPatient$', () => {
        let service = TestBed.inject(PatientService);
        getTestScheduler().schedule(() => service.selectPatient('1'), 10);
        expect(service.selectedPatient$).toBeObservable(hot('ab', { a: '0', b: '1' }));
      });
    });
  });
});
