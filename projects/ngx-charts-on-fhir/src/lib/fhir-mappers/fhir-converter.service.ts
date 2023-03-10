import { Inject, Injectable } from '@angular/core';
import { Bundle } from 'fhir/r4';
import { DataLayer } from '../data-layer/data-layer';
import { MultiMapper } from './multi-mapper.service';

/**
 * Converts a FHIR Bundle into `DataLayer` objects using a `MultiMapper` to map different Resource types.
 */
@Injectable({
  providedIn: 'root',
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
