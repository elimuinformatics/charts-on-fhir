import { Injectable } from '@angular/core';
import { CodeableConcept, Coding, FhirResource } from 'fhir/r4';

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
 *   getName(code: CodeableConcept, resource?: FhirResource): string {
 *     const customCodings = [
 *       {
 *         system: 'http://loinc.org',
 *         code: '85354-9',
 *         display: 'Custom Blood Pressure',
 *       },
 *       // ...
 *     ];
 *     const codingMatch = customCodings.find(codeIn(code));
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
@Injectable()
export class FhirCodeService {
  getName(code: CodeableConcept, resource?: FhirResource): string {
    return code.text ?? '';
  }
}

type CodeOrCoding = CodeableConcept | Coding | Coding[];

/** Check if two codes are equivalent (if they have at least one `Coding` in common) */
export function codeEquals(a: CodeOrCoding, b: CodeOrCoding) {
  return getCodings(a).some(codeIn(b));
}

/** Returns a matcher that can be used with Array functions (find, some, etc.) to match the given code */
export function codeIn(code: CodeOrCoding) {
  return (other: Coding) => getCodings(code).some((coding) => codingEquals(coding, other));
}

/** Check if two codings are equal */
export function codingEquals(a: Coding, b: Coding) {
  return a.system === b.system && a.code === b.code;
}

function getCodings(code: CodeOrCoding): Coding[] {
  if (isCodeableConcept(code)) {
    return code.coding ?? [];
  } else if (Array.isArray(code)) {
    return code;
  } else {
    return [code];
  }
}

function isCodeableConcept(code: CodeOrCoding): code is CodeableConcept {
  return !!(code as CodeableConcept).coding;
}
