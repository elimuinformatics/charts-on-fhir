import { Injectable } from '@angular/core';
import { MedicationRequest } from 'fhir/r4';
import { DataLayerService, FhirDataService, FhirConverter } from 'ngx-charts-on-fhir';
import { from, mergeMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MedicationLayerService extends DataLayerService {
  constructor(private fhir: FhirDataService, private converter: FhirConverter) {
    super();
  }
  name = 'Medications';
  retrieve = () => {
    return this.fhir.getPatientData<MedicationRequest>('MedicationRequest').pipe(mergeMap((bundle) => from(this.converter.convert(bundle))));
  };
}
