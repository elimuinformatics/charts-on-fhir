import { Injectable } from '@angular/core';
import { CodeableConcept, Coding, Observation } from 'fhir/r4';
import { DataLayerService, FhirDataService, FhirConverter, FhirCodeService, codeIn } from '@elimuinformatics/ngx-charts-on-fhir';
import { OperatorFunction, bufferCount, concatMap, delay, from, mergeMap, pipe } from 'rxjs';
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
    return this.fhir.getPatientData<Observation>('Observation' + this.query).pipe(
      mergeMap((bundle) => from(this.converter.convert(bundle))),
      smoothDataAnimations(50)
    );
  };

  getQueryfromCoding(codings: Coding[]) {
    let finalUrl = '?code=';
    codings.forEach((coding: any) => (finalUrl += `${coding.system}|${coding.code},`));
    return finalUrl;
  }
}

/**
 * Operator function that smooths out animations while adding data to the chart.
 * delay(0) makes the emission async, allowing the chart to start animating points in the buffer.
 * Smaller buffer size will give smoother animation, but may impact performance.
 */
function smoothDataAnimations<T>(bufferSize: number): OperatorFunction<T, T> {
  return pipe(
    bufferCount(bufferSize),
    delay(0),
    concatMap((layers) => from(layers))
  );
}
