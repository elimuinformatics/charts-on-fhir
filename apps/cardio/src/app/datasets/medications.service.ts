import { Injectable } from '@angular/core';
import { MedicationRequest } from 'fhir/r4';
import { DataLayerService, FhirDataService, FhirConverter } from '@elimuinformatics/ngx-charts-on-fhir';
import { from, mergeMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MedicationLayerService extends DataLayerService {
  constructor(
    private readonly fhir: FhirDataService,
    private readonly converter: FhirConverter,
  ) {
    super();
  }
  name = 'Medications';
  retrieve = () => {
    return this.fhir.getPatientData<MedicationRequest>('MedicationRequest').pipe(mergeMap((bundle) => from(this.converter.convert(bundle))));
  };
}
