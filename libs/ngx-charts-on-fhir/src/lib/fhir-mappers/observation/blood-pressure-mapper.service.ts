import { Inject, Injectable } from '@angular/core';
import { merge } from 'lodash-es';
import { Coding, Observation } from 'fhir/r4';
import { ComponentObservation, ComponentObservationMapper, isComponentObservation } from './component-observation-mapper.service';
import { Mapper } from '../multi-mapper.service';
import { ANNOTATION_OPTIONS } from '../fhir-mapper-options';
import { ChartAnnotation } from '../../utils';
import { DataLayer } from '../../data-layer/data-layer';
import { getMeasurementSettingSuffix } from './simple-observation-mapper.service';

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
    const datasets = resource.component
      .sort((a, b) => a.code.text.localeCompare(b.code.text))
      .map((component) => ({
        label: this.getBloodPressureTypeBasedOnCode(component) + getMeasurementSettingSuffix(resource),
      }));
    layer.annotations = [
      merge({}, this.annotationOptions, {
        id: 'Systolic Reference Range',
        display: true,
        label: { content: 'Systolic Reference Range' },
        yScaleID: layer.datasets[0].yAxisID,
        yMax: 140,
        yMin: 90,
      }),
      merge({}, this.annotationOptions, {
        id: 'Diastolic Reference Range',
        display: true,
        label: { content: 'Diastolic Reference Range' },
        yScaleID: layer.datasets[0].yAxisID,
        yMax: 90,
        yMin: 60,
      }),
    ];
    return merge({}, layer, {
      datasets,
    });
  }

  getBloodPressureTypeBasedOnCode(component: any) {
    let type: string = '';
    component?.code?.coding?.forEach((reading: any) => {
      if (reading.code && reading.code === '8480-6') {
        type = 'Systolic';
      } else if (reading.code && reading.code === '8462-4') {
        type = 'Diastolic';
      }
    });
    return type;
  }
}
