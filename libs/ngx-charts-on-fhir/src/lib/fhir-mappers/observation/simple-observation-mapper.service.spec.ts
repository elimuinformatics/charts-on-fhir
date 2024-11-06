import { Observation } from 'fhir/r4';
import {
  HOME_DATASET_LABEL_SUFFIX,
  homeEnvironmentCode,
  measurementSettingExtUrl,
  SimpleObservation,
  SimpleObservationMapper,
} from './simple-observation-mapper.service';
import { TestBed } from '@angular/core/testing';
import { ANNOTATION_OPTIONS, LINEAR_SCALE_OPTIONS } from '../fhir-mapper-options';
import { FhirCodeService } from '../fhir-code.service';
import { ReferenceRangeService } from './reference-range.service';

describe('SimpleObservationMapper', () => {
  let mapper: SimpleObservationMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LINEAR_SCALE_OPTIONS, useValue: { type: 'linear' } },
        { provide: ANNOTATION_OPTIONS, useValue: { type: 'box' } },
        SimpleObservationMapper,
        ReferenceRangeService,
        FhirCodeService,
      ],
    });
    mapper = TestBed.inject(SimpleObservationMapper);
  });

  describe('canMap', () => {
    it('should return true for a valid SimpleObservation', () => {
      const observation: SimpleObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'Blood Pressure' },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: { value: 120, unit: 'mmHg', code: 'BP' },
      };
      expect(mapper.canMap(observation)).toBe(true);
    });

    it('should return false if resourceType is not "Observation"', () => {
      const invalidResource = {
        resourceType: 'Condition',
        code: { text: 'Blood Pressure' },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: { value: 120, unit: 'mmHg', code: 'BP' },
      };
      expect(mapper.canMap(invalidResource as Observation)).toBe(false);
    });

    it('should return false if code.text is missing', () => {
      const observation: Observation = {
        resourceType: 'Observation',
        status: 'final',
        code: {},
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: { value: 120, unit: 'mmHg', code: 'BP' },
      };
      expect(mapper.canMap(observation)).toBe(false);
    });

    it('should return false if effectiveDateTime is missing', () => {
      const observation: Observation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'Blood Pressure' },
        valueQuantity: { value: 120, unit: 'mmHg', code: 'BP' },
      };
      expect(mapper.canMap(observation)).toBe(false);
    });

    it('should return false if valueQuantity is missing', () => {
      const observation: Observation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'Blood Pressure' },
        effectiveDateTime: new Date().toISOString(),
      };
      expect(mapper.canMap(observation)).toBe(false);
    });

    it('should return false if valueQuantity.value is missing', () => {
      const observation: Observation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'Blood Pressure' },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: { unit: 'mmHg', code: 'BP' },
      };
      expect(mapper.canMap(observation)).toBe(false);
    });

    it('should return true if valueQuantity.unit and valueQuantity.code are optional', () => {
      const observation: SimpleObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'Blood Pressure' },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: { value: 120 },
      };
      expect(mapper.canMap(observation)).toBe(true);
    });

    it('should return true if valueQuantity.unit is missing but value and code are present', () => {
      const observation: SimpleObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'Blood Pressure' },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: { value: 120, code: 'BP' },
      };
      expect(mapper.canMap(observation)).toBe(true);
    });

    it('should return true if valueQuantity.code is missing but value and unit are present', () => {
      const observation: SimpleObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'Blood Pressure' },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: { value: 120, unit: 'mmHg' },
      };
      expect(mapper.canMap(observation)).toBe(true);
    });
  });

  describe('map', () => {
    it('should map effectiveDateTime to x value in milliseconds', () => {
      const date = new Date();
      const observation: SimpleObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        effectiveDateTime: date.toISOString(),
        valueQuantity: { value: 7, unit: 'unit', code: 'code' },
      };
      expect(mapper.map(observation).datasets[0].data[0].x).toEqual(date.getTime());
    });

    it('should map valueQuantity.value to y value', () => {
      const observation: SimpleObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: { value: 7, unit: 'unit', code: 'code' },
      };
      expect(mapper.map(observation).datasets[0].data[0].y).toEqual(7);
    });

    it('should map valueQuantity.code to the title of a linear scale', () => {
      const observation: SimpleObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: { value: 7, unit: 'unit', code: 'code' },
      };
      expect(mapper.map(observation).scale).toEqual({
        id: 'text',
        type: 'linear',
        title: { text: ['text', 'code'] },
      });
    });

    it('should map referenceRange to an annotation', () => {
      const observation: SimpleObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: { value: 7, unit: 'unit', code: 'code' },
        referenceRange: [
          {
            low: { value: 1 },
            high: { value: 10 },
          },
        ],
      };
      expect(mapper.map(observation).annotations?.[0]).toEqual(
        jasmine.objectContaining({
          type: 'box',
          yScaleID: 'text',
          yMin: 1,
          yMax: 10,
        })
      );
    });

    it('should map category', () => {
      const observation: SimpleObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        category: [{ coding: [{ code: 'A' }] }, { coding: [{ code: 'B' }] }],
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: { value: 7, unit: 'unit', code: 'code' },
      };
      expect(mapper.map(observation).category).toEqual(['A', 'B']);
    });

    it('should add Home suffix for Observation with Measurement Setting extension', () => {
      const observation: SimpleObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: { value: 7, unit: 'unit', code: 'code' },
        extension: [
          {
            url: measurementSettingExtUrl,
            valueCodeableConcept: {
              coding: [{ code: homeEnvironmentCode }],
            },
          },
        ],
      };
      expect(mapper.map(observation).datasets[0].label).toBe('text' + HOME_DATASET_LABEL_SUFFIX);
    });

    it('should use custom layer name as axis label', () => {
      const observation: SimpleObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: { value: 7, unit: 'unit', code: 'code' },
      };
      expect((mapper.map(observation, 'custom').scale as any).title.text[0]).toBe('custom');
    });
  });
});
