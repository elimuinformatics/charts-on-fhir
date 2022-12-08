import { Injectable } from '@angular/core';
import { DataLayerService, FhirConverter } from 'ngx-charts-on-fhir';
import { from, mergeMap } from 'rxjs';
import { FhirDataService } from './fhir-data.service';

@Injectable({
  providedIn: 'root',
})
export class MedicationLayerService extends DataLayerService {
  constructor(private fhir: FhirDataService, private converter: FhirConverter) {
    super();
  }
  name = 'Medications';
  retrieve = () => {
    let data = this.fhir.getMedicationsOrder().pipe(mergeMap((bundle) => from(this.converter.convert(bundle))));
    console.log('data ==> ', data)
    return data; 
  };
}
