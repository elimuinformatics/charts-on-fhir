import { Injectable, Inject, forwardRef } from '@angular/core';
import { ScaleOptions } from 'chart.js';
import { Observation, ObservationComponent } from 'fhir/r2';
import { fromPairs, merge } from 'lodash-es';
import { DataLayer } from '../data-layer/data-layer';
import { Mapper } from '../fhir-converter/multi-mapper.service';
import { ChartAnnotation } from '../utils';
import { TIME_SCALE_OPTIONS, LINEAR_SCALE_OPTIONS, ANNOTATION_OPTIONS } from './fhir-mapper-options';
import { FhirMappersModule } from './fhir-mappers.module';

/** Required properties for mapping an Observation with [ComponentObservationMapper] */
export type ComponentObservation = {
  code: {
    text: string;
  };
  effectiveDateTime: string;
  component: ({
    code: {
      text: string;
    };
    valueQuantity: {
      value: number;
      unit: string;
    };
  } & ObservationComponent)[];
} & Observation;
export function isComponentObservation(resource: Observation): resource is ComponentObservation {
  return !!(
    resource.resourceType === 'Observation' &&
    resource.code?.text &&
    resource.effectiveDateTime &&
    resource.component?.length &&
    resource.component.every((c) => c.code.text && c.valueQuantity?.value && c.valueQuantity?.unit)
  );
}
/** Maps a FHIR Observation resource that has multiple components */
@Injectable({
  providedIn: forwardRef(() => FhirMappersModule),
})
export class ComponentObservationMapper implements Mapper<ComponentObservation> {
  constructor(
    @Inject(TIME_SCALE_OPTIONS) private timeScaleOptions: ScaleOptions<'time'>,
    @Inject(LINEAR_SCALE_OPTIONS) private linearScaleOptions: ScaleOptions<'linear'>,
    @Inject(ANNOTATION_OPTIONS) private annotationOptions: ChartAnnotation
  ) {}
  canMap = isComponentObservation;
  map(resource: ComponentObservation): DataLayer {
    return {
      name: resource.code.text,
      category: resource.category?.text,
      datasets: resource.component
        .sort((a, b) => a.code.text.localeCompare(b.code.text))
        .map((component) => ({
          label: component.code.text,
          yAxisID: component.valueQuantity.unit,
          data: [
            {
              x: new Date(resource.effectiveDateTime).getTime(),
              y: component.valueQuantity.value,
            },
          ],
        }))
        .sort(),
      scales: fromPairs([
        ['timeline', this.timeScaleOptions],
        ...resource.component.map((component) => [
          component.valueQuantity.unit,
          merge({}, this.linearScaleOptions, {
            title: { text: component.valueQuantity.unit },
          }),
        ]),
      ]),
      annotations: resource.component.flatMap(
        (component) =>
          component.referenceRange?.map((range) =>
            merge({}, this.annotationOptions, {
              label: { content: `${component.code.text} Reference Range` },
              yScaleID: component.valueQuantity.unit,
              yMax: range?.high?.value,
              yMin: range?.low?.value,
            })
          ) ?? []
      ),
    };
  }
}
