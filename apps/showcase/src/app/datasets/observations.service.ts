import { Injectable } from '@angular/core';
import { Bundle, Observation } from 'fhir/r4';
import { DataLayerService, FhirDataService, FhirConverter } from '@elimuinformatics/ngx-charts-on-fhir';
import { from, mergeMap } from 'rxjs';
import data from './data.json';
@Injectable({
  providedIn: 'root',
})
export class ObservationLayerService extends DataLayerService {
  constructor(private fhir: FhirDataService, private converter: FhirConverter) {
    super();
  }
  name = 'Observations';
  retrieve = () => {
    return from(this.converter.convert(data as Bundle));
  };
}
