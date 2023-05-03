import { Injectable } from '@angular/core';
import { CodeableConcept, Coding, Observation } from 'fhir/r4';
import { DataLayerService, FhirDataService, FhirConverter, FhirCodeService, codeIn } from '@elimuinformatics/ngx-charts-on-fhir';
import { from, mergeMap } from 'rxjs';
import observationCodings from './observations.json';

@Injectable({ providedIn: 'root' })
export class CustomFhirCodeService extends FhirCodeService {
  override getName(code: CodeableConcept): string {
    const codingMatch = observationCodings.find(codeIn(code));
    if (codingMatch) {
      return codingMatch?.display;
    }
    return super.getName(code);
  }
}

@Injectable({ providedIn: 'root' })
export class ObservationLayerService extends DataLayerService {
  query: string = '';
  constructor(private fhir: FhirDataService, private converter: FhirConverter) {
    super();
    this.query = this.getQueryfromCoding(observationCodings);
  }
  name = 'Observations';

  retrieve = () => {
    return this.fhir.getPatientData<Observation>('Observation' + this.query).pipe(mergeMap((bundle) => from(this.converter.convert(bundle))));
  };

  getQueryfromCoding(codings: Coding[]) {
    let finalUrl = '?code=';
    codings.forEach((coding: any) => (finalUrl += `${coding.system}|${coding.code},`));
    return finalUrl;
  }
}
