import { Injectable } from '@angular/core';
import { DataLayerService, FhirConverter } from 'ngx-charts-on-fhir';
import { from, mergeMap } from 'rxjs';
import { FhirDataService } from './fhir-data.service';

@Injectable({
  providedIn: 'root',
})
export class ObservationLayerService extends DataLayerService {
  constructor(private fhir: FhirDataService, private converter: FhirConverter) {
    super();
  }
  name = 'Observations';
  retrieve = () => {
    return this.fhir.getObservations().pipe(mergeMap((bundle) => from(this.converter.convert(bundle))));
  };
}
