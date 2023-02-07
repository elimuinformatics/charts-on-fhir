import { Injectable } from '@angular/core';
import { BundleEntry, Patient } from 'fhir/r4';
import { BehaviorSubject, filter, map, scan, shareReplay } from 'rxjs';
import { DataLayerManagerService } from '../data-layer/data-layer-manager.service';
import { FhirDataService } from '../fhir-data/fhir-data.service';
import { isDefined } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  constructor(private fhir: FhirDataService, private layerManager: DataLayerManagerService) {}

  patients$ = this.fhir.getPatientData<Patient>('Patient', false).pipe(
    map((bundle) => bundle.entry),
    filter(isDefined),
    map(getPatientList),
    scan((acc, value) => [...acc, ...value]),
    shareReplay(1)
  );

  selectedPatientSubject = new BehaviorSubject<string | undefined>(undefined);
  selectedPatient$ = this.selectedPatientSubject.asObservable();

  selectPatient(patientId: string) {
    this.layerManager.reset();
    this.fhir.changePatient(patientId);
    this.selectedPatientSubject.next(patientId);
    this.layerManager.retrieveAll();
  }
}

function getPatientList(entries: BundleEntry<Patient>[]) {
  return entries
    .filter(isDefined)
    .map((entry) => entry.resource)
    .filter(isDefined)
    .map((resource) => ({
      id: resource.id ?? '',
      name: [...(resource.name?.[0].given ?? []), resource.name?.[0].family].join(' '),
    }));
}
