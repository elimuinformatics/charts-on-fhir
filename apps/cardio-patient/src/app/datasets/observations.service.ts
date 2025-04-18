import { Injectable } from '@angular/core';
import { Observation } from 'fhir/r4';
import { DataLayerService, FhirDataService, FhirConverter } from '@elimuinformatics/ngx-charts-on-fhir';
import { from, mergeMap } from 'rxjs';

interface Coding {
  system?: string;
  code?: string;
  display?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ObservationLayerService extends DataLayerService {
  codings: Coding[] = [
    {
      system: 'http://loinc.org',
      code: '85354-9',
      display: 'Blood Pressure',
    },
  ];
  query: string = '';
  constructor(
    private readonly fhir: FhirDataService,
    private readonly converter: FhirConverter,
  ) {
    super();
    this.query = this.getQueryfromCoding(this.codings);
  }
  name = 'Observations';

  retrieve = () => {
    return this.fhir.getPatientData<Observation>('Observation' + this.query).pipe(mergeMap((bundle) => from(this.converter.convert(bundle))));
  };

  getQueryfromCoding(codings: Coding[]) {
    let finalUrl = '?code=';
    codings.forEach((coding: any) => (finalUrl += `${coding.system}|${coding.code},`));
    return finalUrl + '&_sort=-date';
  }
}
