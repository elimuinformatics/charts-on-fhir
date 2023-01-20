import { Injectable } from '@angular/core';
import { Observation } from 'fhir/r4';
import { DataLayerService, FhirDataService, FhirConverter } from 'ngx-charts-on-fhir';
import { from, mergeMap } from 'rxjs';

interface Coding {
  system?: string,
  code?: string,
  display?: string
}

@Injectable({
  providedIn: 'root',
})
export class ObservationLayerService extends DataLayerService {
  codings: Coding[] = [
    {
      "system": "http://loinc.org",
      "code": "29463-7",
      "display": "Body Weight"
    },
    {
      "system": "http://loinc.org",
      "code": "85354-9",
      "display": "Blood Pressure"
    },
    {
      "system": "http://loinc.org",
      "code": "8867-4",
      "display": "Heart rate"
    }
  ]
  query: string = '';
  constructor(private fhir: FhirDataService, private converter: FhirConverter) {
    super();
    this.query = this.getQueryfromCoding(this.codings);
  }
  name = 'Observations';

  retrieve = () => {
    return this.fhir.getPatientData<Observation>('Observation' + this.query).pipe(mergeMap((bundle) => from(this.converter.convert(bundle))));
  };

  getQueryfromCoding(codings: Coding[]) {
    let finalUrl = '?code=';
    codings.map((coding: any) => finalUrl += `${coding.system}|${coding.code},`)
    return finalUrl;
  }
}
