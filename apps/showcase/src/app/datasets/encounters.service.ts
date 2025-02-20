import { Injectable } from '@angular/core';
import { DataLayerService, FhirDataService, FhirConverter } from '@elimuinformatics/ngx-charts-on-fhir';
import { Encounter } from 'fhir/r4';
import { from, mergeMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EncounterLayerService extends DataLayerService {
  constructor(
    private readonly fhir: FhirDataService,
    private readonly converter: FhirConverter,
  ) {
    super();
  }
  name = 'Medications';
  retrieve = () => {
    return this.fhir.getPatientData<Encounter>('Encounter').pipe(mergeMap((bundle) => from(this.converter.convert(bundle))));
  };
}
