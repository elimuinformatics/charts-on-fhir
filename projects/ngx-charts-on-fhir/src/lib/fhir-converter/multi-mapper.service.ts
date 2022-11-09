import { Inject, Injectable } from '@angular/core';
import { ChartType, ScatterDataPoint } from 'chart.js';
import { TimelineChartType, DataLayer } from '../data-layer/data-layer';
import { FhirConverterModule } from './fhir-converter.module';

/** Maps properties from a single resource to properties on a DataLayer */
export abstract class Mapper<R, T extends ChartType = TimelineChartType, D = ScatterDataPoint[]> {
  abstract canMap(resource: unknown): resource is R;
  abstract map(resource: R): DataLayer<T, D>;
}

/**
 * Delegates to another [Mapper] from the provided mappers array, using the first one that is capable of mapping each resource.
 */
@Injectable({
  providedIn: FhirConverterModule,
})
export class MultiMapper implements Mapper<unknown, TimelineChartType, ScatterDataPoint[]> {
  constructor(@Inject(Mapper) private mappers: Mapper<unknown, TimelineChartType, ScatterDataPoint[]>[]) {}
  canMap(resource: unknown): resource is unknown {
    return this.mappers.some((mapper) => mapper.canMap(resource));
  }
  map(resource: unknown): DataLayer {
    for (let mapper of this.mappers) {
      if (mapper.canMap(resource)) {
        return mapper.map(resource);
      }
    }
    throw new TypeError(`This mapper cannot map the resource ${JSON.stringify(resource)}`);
  }
}
