import { Injectable } from '@angular/core';
import { Bundle, MedicationRequest } from 'fhir/r4';
import { DataLayerService, FhirDataService, FhirConverter } from '@elimuinformatics/ngx-charts-on-fhir';
import { from, mergeMap } from 'rxjs';
import medication from './medication.json';
@Injectable({
  providedIn: 'root',
})
export class MedicationLayerService extends DataLayerService {
  constructor(private fhir: FhirDataService, private converter: FhirConverter) {
    super();
  }
  name = 'Medications';
  retrieve = () => {
    return from(this.converter.convert(medication as Bundle));
  };
}
