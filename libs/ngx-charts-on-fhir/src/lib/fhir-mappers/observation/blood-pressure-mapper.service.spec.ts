import { TestBed } from '@angular/core/testing';
import { ANNOTATION_OPTIONS, LINEAR_SCALE_OPTIONS } from '../fhir-mapper-options';
import { BloodPressureMapper, BloodPressureObservation } from './blood-pressure-mapper.service';
import { ComponentObservationMapper } from './component-observation-mapper.service';
import { FhirCodeService } from '../fhir-code.service';
import { ReferenceRangeService } from './reference-range.service';

describe('BloodPressureMapper', () => {
  let mapper: BloodPressureMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FhirCodeService,
        BloodPressureMapper,
        ComponentObservationMapper,
        { provide: LINEAR_SCALE_OPTIONS, useValue: {} },
        { provide: ANNOTATION_OPTIONS, useValue: {} },
        { provide: ReferenceRangeService, useClass: ReferenceRangeService },
      ],
    });
    mapper = TestBed.inject(BloodPressureMapper);
  });

  describe('canMap', () => {
    it('should return true for an Observation with code 85354-9 (Blood Pressure)', () => {
      const observation: BloodPressureObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { coding: [{ system: 'http://loinc.org', code: '85354-9' }], text: 'Blood Pressure' },
        effectiveDateTime: new Date().toISOString(),
        component: [
          {
            code: { text: 'component' },
            valueQuantity: { value: 7, unit: 'unit', code: 'code' },
          },
        ],
      };
      expect(mapper.canMap(observation)).toBe(true);
    });

    it('should return false for an Observation with code 8867-4 (Heart Rate)', () => {
      const observation: BloodPressureObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { coding: [{ system: 'http://loinc.org', code: '8867-4' as any }], text: '' },
        effectiveDateTime: new Date().toISOString(),
        component: [
          {
            code: { text: '' },
            valueQuantity: { value: 7, unit: 'unit', code: 'code' },
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
        code: { coding: [{ system: 'http://loinc.org', code: '85354-9' }], text: 'Blood Pressure' },
        effectiveDateTime: new Date().toISOString(),
        component: [
          {
            code: { coding: [{ system: 'http://loinc.org', code: '8480-6' }], text: 'Systolic' },
            valueQuantity: { value: 7, unit: 'unit', code: 'code' },
          },
          {
            code: { coding: [{ system: 'http://loinc.org', code: '8462-4' }], text: 'Diastolic' },
            valueQuantity: { value: 7, unit: 'unit', code: 'code' },
          },
        ],
      };
      const layer = mapper.map(observation);
      const systolicAnnoId = layer.datasets.find((dataset) => dataset.label?.startsWith('Systolic'))?.chartsOnFhir?.referenceRangeAnnotation;
      const diastolicAnnoId = layer.datasets.find((dataset) => dataset.label?.startsWith('Diastolic'))?.chartsOnFhir?.referenceRangeAnnotation;
      expect(layer.annotations?.find((anno) => anno.id === systolicAnnoId)).toEqual(
        jasmine.objectContaining({
          label: { content: 'Systolic Reference Range' },
          yMax: 140,
          yMin: 90,
        })
      );
      expect(layer.annotations?.find((anno) => anno.id === diastolicAnnoId)).toEqual(
        jasmine.objectContaining({
          label: { content: 'Diastolic Reference Range' },
          yMax: 90,
          yMin: 60,
        })
      );
    });
  });
});
