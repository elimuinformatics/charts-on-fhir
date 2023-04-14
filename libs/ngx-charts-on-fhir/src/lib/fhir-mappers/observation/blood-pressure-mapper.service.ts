import { Inject, Injectable } from '@angular/core';
import { merge } from 'lodash-es';
import { Coding, Observation } from 'fhir/r4';
import { ComponentObservation, ComponentObservationMapper, isComponentObservation } from './component-observation-mapper.service';
import { Mapper } from '../multi-mapper.service';
import { ANNOTATION_OPTIONS } from '../fhir-mapper-options';
import { ChartAnnotation } from '../../utils';
import { DataLayer } from '../../data-layer/data-layer';

const bpCodes = ['85354-9'] as const;
export type BloodPressureObservation = {
  code: {
    coding: ({
      code: typeof bpCodes[number];
    } & Coding)[];
  };
} & ComponentObservation;
export function isBloodPressureObservation(resource: Observation): resource is BloodPressureObservation {
  return isComponentObservation(resource) && !!resource.code.coding?.every((c) => bpCodes.includes(c.code as any));
}
@Injectable({
  providedIn: 'root',
})
export class BloodPressureMapper implements Mapper<BloodPressureObservation> {
  constructor(private baseMapper: ComponentObservationMapper, @Inject(ANNOTATION_OPTIONS) private annotationOptions: ChartAnnotation) {}
  canMap = isBloodPressureObservation;
  map(resource: BloodPressureObservation): DataLayer {
    const layer = this.baseMapper.map(resource);
    layer.annotations = [
      merge({}, this.annotationOptions, {
        id: 'Systolic Blood Pressure Reference Range',
        display: true,
        label: { content: 'Systolic Blood Pressure Reference Range' },
        yScaleID: layer.datasets[0].yAxisID,
        yMax: 140,
        yMin: 90,
      }),
      merge({}, this.annotationOptions, {
        id: 'Diastolic Blood Pressure Reference Range',
        display: true,
        label: { content: 'Diastolic Blood Pressure Reference Range' },
        yScaleID: layer.datasets[0].yAxisID,
        yMax: 90,
        yMin: 60,
      }),
    ];
    return layer;
  }
}
