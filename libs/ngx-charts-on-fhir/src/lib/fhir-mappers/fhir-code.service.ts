import { Injectable } from '@angular/core';
import { CodeableConcept } from 'fhir/r4';

@Injectable({ providedIn: 'root' })
export class FhirCodeService {
  getName(code: CodeableConcept): string {
    return code.text ?? '';
  }
}
