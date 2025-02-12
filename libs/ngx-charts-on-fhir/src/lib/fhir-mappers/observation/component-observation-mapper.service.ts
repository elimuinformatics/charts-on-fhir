import { Injectable, Inject } from '@angular/core';
import { ScaleOptions } from 'chart.js';
import { Observation, ObservationComponent } from 'fhir/r4';
import { merge } from 'lodash-es';
import { DataLayer } from '../../data-layer/data-layer';
import { Mapper } from '../multi-mapper.service';
import { isDefined } from '../../utils';
import { LINEAR_SCALE_OPTIONS } from '../fhir-mapper-options';
import { getMeasurementSettingSuffix, isHomeMeasurement } from './simple-observation-mapper.service';
import { FhirCodeService } from '../fhir-code.service';
import { ReferenceRangeService } from './reference-range.service';

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
      code: string;
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
        c.valueQuantity?.value != null &&
        c.valueQuantity?.unit &&
        c.valueQuantity?.code &&
        // all components must have the same units of measure
        c.valueQuantity.unit === resource?.component?.[0].valueQuantity?.unit,
    )
  );
}
/** Maps a FHIR Observation resource that has multiple components */
@Injectable()
export class ComponentObservationMapper implements Mapper<ComponentObservation> {
  constructor(
    @Inject(LINEAR_SCALE_OPTIONS) private readonly linearScaleOptions: ScaleOptions<'linear'>,
    private readonly codeService: FhirCodeService,
    private readonly referenceRangeService: ReferenceRangeService,
  ) {}
  canMap = isComponentObservation;
  map(resource: ComponentObservation, overrideLayerName?: string): DataLayer {
    const codeName = this.codeService.getName(resource.code, resource);
    const layerName = overrideLayerName ?? codeName;
    return {
      name: layerName,
      category: resource.category?.flatMap((c) => c.coding?.map((coding) => coding.code)).filter(isDefined),
      datasets: resource.component.map((component) => ({
        label: this.codeService.getName(component.code, resource) + getMeasurementSettingSuffix(resource),
        yAxisID: layerName,
        data: [
          {
            x: new Date(resource.effectiveDateTime).getTime(),
            y: component.valueQuantity.value,
            resource,
          },
        ],
        chartsOnFhir: {
          group: this.codeService.getName(component.code, resource),
          colorPalette: isHomeMeasurement(resource) ? 'light' : 'dark',
          tags: [isHomeMeasurement(resource) ? 'Home' : 'Clinic'],
          referenceRangeAnnotation: this.referenceRangeService.getAnnotationLabel(
            component.referenceRange?.[0],
            this.codeService.getName(component.code, resource),
          ),
        },
      })),
      scale: merge({}, this.linearScaleOptions, {
        id: layerName,
        title: { text: [layerName, resource.component[0].valueQuantity.code] },
        stackWeight: resource.component.length,
      }),
      annotations: resource.component
        .flatMap((component) =>
          component.referenceRange?.map((range) =>
            this.referenceRangeService.createReferenceRangeAnnotation(range, this.codeService.getName(component.code, resource), layerName),
          ),
        )
        .filter(isDefined),
    };
  }
}
