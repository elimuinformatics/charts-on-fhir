import { Injectable } from '@angular/core';
import { Coding, Observation } from 'fhir/r4';
import { ComponentObservation, ComponentObservationMapper, isComponentObservation } from './component-observation-mapper.service';
import { Mapper } from '../multi-mapper.service';
import { DataLayer } from '../../data-layer/data-layer';
import { codeEquals } from '../fhir-code.service';

const bpCode = {
  system: 'http://loinc.org',
  code: '85354-9',
  display: 'Blood Pressure',
} as const;

const systolicCode = {
  system: 'http://loinc.org',
  code: '8480-6',
  display: 'Systolic',
} as const;

const diastolicCode = {
  system: 'http://loinc.org',
  code: '8462-4',
  display: 'Diastolic',
} as const;

export type BloodPressureObservation = {
  code: {
    coding: ({
      system: typeof bpCode.system;
      code: typeof bpCode.code;
    } & Coding)[];
  };
} & ComponentObservation;
export function isBloodPressureObservation(resource: Observation): resource is BloodPressureObservation {
  return isComponentObservation(resource) && !!codeEquals(resource.code, bpCode);
}
@Injectable({
  providedIn: 'root',
})
export class BloodPressureMapper implements Mapper<BloodPressureObservation> {
  constructor(private baseMapper: ComponentObservationMapper) {}
  canMap = isBloodPressureObservation;
  map(resource: BloodPressureObservation, layerName?: string): DataLayer {
    for (let component of resource.component) {
      if (codeEquals(component.code, systolicCode)) {
        component.referenceRange = [
          {
            high: { value: 140 },
            low: { value: 90 },
          },
        ];
      }
      if (codeEquals(component.code, diastolicCode)) {
        component.referenceRange = [
          {
            high: { value: 90 },
            low: { value: 60 },
          },
        ];
      }
    }
    return this.baseMapper.map(resource, layerName);
  }
}
