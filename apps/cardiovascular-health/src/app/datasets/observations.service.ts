import { Injectable } from '@angular/core';
import { CodeableConcept, Coding, Observation } from 'fhir/r4';
import { DataLayerService, FhirDataService, FhirConverter, FhirCodeService } from '@elimuinformatics/ngx-charts-on-fhir';
import { from, mergeMap } from 'rxjs';

const observationCodings = [
  {
    system: 'http://loinc.org',
    code: '29463-7',
    display: 'Body Weight',
  },
  {
    system: 'http://loinc.org',
    code: '85354-9',
    display: 'Blood Pressure',
  },
  {
    system: 'http://loinc.org',
    code: '8480-6',
    display: 'Systolic',
  },
  {
    system: 'http://loinc.org',
    code: '8462-4',
    display: 'Diastolic',
  },
  {
    system: 'http://loinc.org',
    code: '8867-4',
    display: 'Heart Rate',
  },
  {
    system: 'http://loinc.org',
    code: '74774-1',
    display: 'Glucose',
  },
  {
    system: 'http://loinc.org',
    code: '2339-0',
    display: 'Glucose',
  },
  {
    system: 'http://loinc.org',
    code: '4548-4',
    display: 'Hemoglobin A1c',
  },
  {
    system: 'http://loinc.org',
    code: '59408-5',
    display: 'O2 Saturation',
  },
  {
    system: 'http://loinc.org',
    code: '55423-8',
    display: 'Step Count',
  },
  {
    system: 'http://loinc.org',
    code: '41950-7',
    display: 'Step Count',
  },
];

@Injectable({ providedIn: 'root' })
export class CustomFhirCodeService extends FhirCodeService {
  override getName(code: CodeableConcept): string {
    const codingMatch = observationCodings.find((candidate) =>
      code.coding?.some((coding) => coding.system === candidate.system && coding.code === candidate.code)
    );
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
