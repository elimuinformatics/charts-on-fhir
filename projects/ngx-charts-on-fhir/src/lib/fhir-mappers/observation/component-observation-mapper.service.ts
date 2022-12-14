import { Injectable, Inject, forwardRef } from '@angular/core';
import { ScaleOptions } from 'chart.js';
import { Observation, ObservationComponent } from 'fhir/r4';
import { merge } from 'lodash-es';
import { DataLayer } from '../../data-layer/data-layer';
import { Mapper } from '../../fhir-converter/multi-mapper.service';
import { ChartAnnotation, isDefined } from '../../utils';
import { TIME_SCALE_OPTIONS, LINEAR_SCALE_OPTIONS, ANNOTATION_OPTIONS } from '../fhir-mapper-options';
import { FhirMappersModule } from '../fhir-mappers.module';

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
    resource.component.every(
      (c) =>
        c.code.text &&
        c.valueQuantity?.value &&
        c.valueQuantity?.unit &&
        // all components must have the same units of measure
        c.valueQuantity.unit === resource?.component?.[0].valueQuantity?.unit
    )
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
    const scaleName = `${resource.code.text} (${resource.component[0].valueQuantity.unit})`;
    return {
      name: resource.code.text,
      category: resource.category?.flatMap((c) => c.coding?.map((coding) => coding.display)).filter(isDefined),
      datasets: resource.component
        .sort((a, b) => a.code.text.localeCompare(b.code.text))
        .map((component) => ({
          label: component.code.text,
          yAxisID: scaleName,
          data: [
            {
              x: new Date(resource.effectiveDateTime).getTime(),
              y: component.valueQuantity.value,
            },
          ],
        })),
      scales: {
        timeline: this.timeScaleOptions,
        [scaleName]: merge({}, this.linearScaleOptions, {
          title: { text: scaleName },
          stackWeight: resource.component.length,
        }),
      },
      annotations: resource.component.flatMap(
        (component) =>
          component.referenceRange?.map((range) =>
            merge({}, this.annotationOptions, {
              label: { content: `${component.code.text} Reference Range` },
              yScaleID: scaleName,
              yMax: range?.high?.value,
              yMin: range?.low?.value,
            })
          ) ?? []
      ),
    };
  }
}
