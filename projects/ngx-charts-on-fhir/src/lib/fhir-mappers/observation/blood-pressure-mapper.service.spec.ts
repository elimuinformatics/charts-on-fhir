import { TestBed } from '@angular/core/testing';
import { TIME_SCALE_OPTIONS, ANNOTATION_OPTIONS, LINEAR_SCALE_OPTIONS } from '../fhir-mapper-options';
import { BloodPressureMapper, BloodPressureObservation } from './blood-pressure-mapper.service';
import { ComponentObservationMapper } from './component-observation-mapper.service';

describe('BloodPressureMapper', () => {
  let mapper: BloodPressureMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BloodPressureMapper,
        ComponentObservationMapper,
        { provide: TIME_SCALE_OPTIONS, useValue: {} },
        { provide: LINEAR_SCALE_OPTIONS, useValue: {} },
        { provide: ANNOTATION_OPTIONS, useValue: {} },
      ],
    });
    mapper = TestBed.inject(BloodPressureMapper);
  });

  describe('canMap', () => {
    it('should return true for an Observation with code 85354-9 (Blood Pressure)', () => {
      const observation: BloodPressureObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { coding: [{ code: '85354-9' }], text: 'Blood Pressure' },
        effectiveDateTime: new Date().toISOString(),
        component: [
          {
            code: { text: 'component' },
            valueQuantity: { value: 7, unit: 'unit' },
          },
        ],
      };
      expect(mapper.canMap(observation)).toBe(true);
    });

    it('should return false for an Observation with code 8867-4 (Heart Rate)', () => {
      const observation: BloodPressureObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { coding: [{ code: '8867-4' as any }], text: '' },
        effectiveDateTime: new Date().toISOString(),
        component: [
          {
            code: { text: '' },
            valueQuantity: { value: 7, unit: 'unit' },
          },
        ],
      };
      expect(mapper.canMap(observation)).toBe(false);
    });
  });

  describe('map', () => {
    it('should add reference range annotations', () => {
      const observation: BloodPressureObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { coding: [{ code: '85354-9' }], text: 'Blood Pressure' },
        effectiveDateTime: new Date().toISOString(),
        component: [
          {
            code: { text: 'component' },
            valueQuantity: { value: 7, unit: 'unit' },
          },
        ],
      };
      expect(mapper.map(observation).annotations).toEqual([
        jasmine.objectContaining({ label: { content: 'Systolic Blood Pressure Reference Range' } }),
        jasmine.objectContaining({ label: { content: 'Diastolic Blood Pressure Reference Range' } }),
      ]);
    });
  });
});
