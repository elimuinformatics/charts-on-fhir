import { Injectable } from '@angular/core';
import { BundleEntry, Patient } from 'fhir/r4';
import { EMPTY, filter, map, ReplaySubject, scan, shareReplay } from 'rxjs';
import { FhirDataService } from '../fhir-data/fhir-data.service';
import { isDefined } from '../utils';

@Injectable()
export class PatientService {
  constructor(private fhir: FhirDataService) {
    const patient = this.fhir.client?.getPatientId();
    if (patient) {
      this.selectedPatientSubject.next(patient);
    }
  }

  isSinglePatientContext = this.fhir.isSmartLaunch;

  patients$ = this.isSinglePatientContext
    ? EMPTY
    : this.fhir.getPatientData<Patient>('Patient', false).pipe(
        map((bundle) => bundle.entry),
        filter(isDefined),
        map(getPatientList),
        scan((acc, value) => [...acc, ...value]),
        shareReplay(1)
      );

  selectedPatientSubject = new ReplaySubject<string>();
  selectedPatient$ = this.selectedPatientSubject.asObservable();

  selectPatient(patientId: string) {
    this.fhir.changePatient(patientId);
    this.selectedPatientSubject.next(patientId);
  }
}

function getPatientList(entries: BundleEntry<Patient>[]) {
  return entries
    .filter(isDefined)
    .map((entry) => entry.resource)
    .filter(isDefined)
    .map((patient) => getPatientDetails(patient));
}

function getPatientDetails(patient?: Patient) {
  if (!patient) {
    throw new Error('Patient is not defined');
  }
  return {
    id: patient.id ?? '',
    name: [...(patient.name?.[0].given ?? []), patient.name?.[0].family].join(' '),
  };
}
