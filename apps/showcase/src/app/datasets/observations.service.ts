import { Injectable } from '@angular/core';
import { Observation } from 'fhir/r4';
import { DataLayerService, FhirDataService, FhirConverter } from '@elimuinformatics/ngx-charts-on-fhir';
import { from, mergeMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ObservationLayerService extends DataLayerService {
  constructor(private fhir: FhirDataService, private converter: FhirConverter) {
    super();
  }
  name = 'Observations';
  retrieve = () => {
    return this.fhir.getPatientData<Observation>('Observation').pipe(mergeMap((bundle) => from(this.converter.convert(bundle))));
  };
}
