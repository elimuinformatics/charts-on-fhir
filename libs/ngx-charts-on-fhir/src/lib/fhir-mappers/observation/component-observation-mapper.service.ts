import { Injectable, Inject } from '@angular/core';
import { ScaleOptions } from 'chart.js';
import { Observation, ObservationComponent } from 'fhir/r4';
import { merge } from 'lodash-es';
import { DataLayer } from '../../data-layer/data-layer';
import { Mapper } from '../multi-mapper.service';
import { ChartAnnotation, isDefined } from '../../utils';
import { LINEAR_SCALE_OPTIONS, ANNOTATION_OPTIONS } from '../fhir-mapper-options';
import { getMeasurementSettingSuffix, isHomeMeasurement } from './simple-observation-mapper.service';
import { FhirCodeService } from '../fhir-code.service';

/** Required properties for mapping an Observation with `ComponentObservationMapper` */
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
  providedIn: 'root',
})
export class ComponentObservationMapper implements Mapper<ComponentObservation> {
  constructor(
    @Inject(LINEAR_SCALE_OPTIONS) private linearScaleOptions: ScaleOptions<'linear'>,
    @Inject(ANNOTATION_OPTIONS) private annotationOptions: ChartAnnotation,
    private codeService: FhirCodeService
  ) {}
  canMap = isComponentObservation;
  map(resource: ComponentObservation): DataLayer {
    const codeName = this.codeService.getName(resource.code);
    return {
      name: codeName,
      category: resource.category?.flatMap((c) => c.coding?.map((coding) => coding.display)).filter(isDefined),
      datasets: resource.component.map((component) => ({
        label: this.codeService.getName(component.code) + getMeasurementSettingSuffix(resource),
        yAxisID: codeName,
        data: [
          {
            x: new Date(resource.effectiveDateTime).getTime(),
            y: component.valueQuantity.value,
            resource,
          },
        ],
        chartsOnFhir: {
          group: this.codeService.getName(component.code),
          colorPalette: isHomeMeasurement(resource) ? 'light' : 'dark',
          tags: [isHomeMeasurement(resource) ? 'Home' : 'Clinic'],
          referenceRangeAnnotation: `${this.codeService.getName(component.code)} Reference Range`,
        },
      })),
      scale: merge({}, this.linearScaleOptions, {
        id: codeName,
        title: { text: [codeName, resource.component[0].valueQuantity.unit] },
        stackWeight: resource.component.length,
      }),
      annotations: resource.component.flatMap(
        (component) =>
          component.referenceRange?.map((range) =>
            merge({}, this.annotationOptions, {
              id: `${this.codeService.getName(component.code)} Reference Range`,
              label: { content: `${this.codeService.getName(component.code)} Reference Range` },
              yScaleID: codeName,
              yMax: range?.high?.value,
              yMin: range?.low?.value,
            })
          ) ?? []
      ),
    };
  }
}
