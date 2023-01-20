import { Inject, Injectable } from '@angular/core';
import { merge } from 'lodash-es';
import { Coding, Observation } from 'fhir/r4';
import {
  ComponentObservation,
  ANNOTATION_OPTIONS,
  ChartAnnotation,
  isComponentObservation,
  DataLayer,
  ComponentObservationMapper,
  Mapper,
} from 'ngx-charts-on-fhir';

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
      // merge({}, this.annotationOptions, {
      //   label: { content: 'Normal blood pressure' },
      //   yScaleID: layer.datasets[0].yAxisID,
      //   yMax: 120,
      //   yMin: 80,
      // }),
      merge({}, this.annotationOptions, {
        display: true,
        label: { content: 'Systolic Blood Pressure Reference Range' },
        yScaleID: layer.datasets[0].yAxisID,
        yMax: 130,
        yMin: 90,
      }),
      merge({}, this.annotationOptions, {
        display: true,
        label: { content: 'Diastolic Blood Pressure Reference Range' },
        yScaleID: layer.datasets[0].yAxisID,
        yMax: 80,
        yMin: 60,
      }),
    ];
    return layer;
  }
}
