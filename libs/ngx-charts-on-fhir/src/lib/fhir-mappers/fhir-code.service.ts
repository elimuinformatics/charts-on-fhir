import { Injectable } from '@angular/core';
import { CodeableConcept } from 'fhir/r4';

/**
 * A service for getting the display name of a FHIR `CodableConcept`.
 * The default implementation just returns the `text` property.
 *
 * @usageNotes
 * Applications can extend this service to customize the labels associated with specific codes.
 * For example:
 * ```ts
 * @Injectable({ providedIn: 'root' })
 * export class CustomFhirCodeService extends FhirCodeService {
 *   getName(code: CodeableConcept): string {
 *     const customCodings = [
 *       {
 *         system: 'http://loinc.org',
 *         code: '85354-9',
 *         display: 'Custom Blood Pressure',
 *       },
 *       // ...
 *     ];
 *     const codingMatch = customCodings.find((candidate) =>
 *       code.coding?.some((coding) => coding.system === candidate.system && coding.code === candidate.code)
 *     );
 *     if (codingMatch) {
 *       return codingMatch?.display;
 *     }
 *     return super.getName(code);
 *   }
 * }
 * ```
 *
 * Replace the default implementation by adding the new one to AppModule's providers array:
 *
 * ```ts
 * @NgModule({
 *   providers: [
 *     { provide: FhirCodeService, useExisting: CustomFhirCodeService }
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
@Injectable({ providedIn: 'root' })
export class FhirCodeService {
  getName(code: CodeableConcept): string {
    return code.text ?? '';
  }
}
