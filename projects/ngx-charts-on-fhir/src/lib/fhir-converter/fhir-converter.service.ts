import { Inject, Injectable } from '@angular/core';
import { Bundle } from 'fhir/r2';
import { DataLayer } from '../data-layer/data-layer';
import { FhirConverterModule } from './fhir-converter.module';
import { MultiMapper } from './multi-mapper.service';

/**
 * Converts a FHIR Bundle into [DataLayer]s using a [GroupConverter] to group similar Resources.
 */
@Injectable({
  providedIn: FhirConverterModule,
})
export class FhirConverter {
  constructor(@Inject(MultiMapper) private mapper: MultiMapper) {}
  convert(bundle: Bundle): DataLayer[] {
    if (!bundle.entry) {
      return [];
    }
    return bundle.entry
      .map((entry) => entry.resource)
      .filter((resource) => this.mapper.canMap(resource))
      .map((resource) => this.mapper.map(resource));
  }
}
