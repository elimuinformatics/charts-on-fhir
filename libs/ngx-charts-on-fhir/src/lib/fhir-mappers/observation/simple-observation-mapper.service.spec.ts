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

describe('SimpleObservationMapper', () => {
  let mapper: SimpleObservationMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: LINEAR_SCALE_OPTIONS, useValue: { type: 'linear' } }, { provide: ANNOTATION_OPTIONS, useValue: { type: 'box' } }, FhirCodeService],
    });
    mapper = TestBed.inject(SimpleObservationMapper);
  });

  describe('canMap', () => {
    it('should return true for a SimpleObservation', () => {
      const observation: SimpleObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: { value: 7, unit: 'unit' },
      };
      expect(mapper.canMap(observation)).toBe(true);
    });

    it('should return false for an Observation with no valueQuantity', () => {
      const observation: Observation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        effectiveDateTime: new Date().toISOString(),
      };
      expect(mapper.canMap(observation)).toBe(false);
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
        valueQuantity: { value: 7, unit: 'unit' },
      };
      expect(mapper.map(observation).datasets[0].data[0].x).toEqual(date.getTime());
    });

    it('should map valueQuantity.value to y value', () => {
      const observation: SimpleObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: { value: 7, unit: 'unit' },
      };
      expect(mapper.map(observation).datasets[0].data[0].y).toEqual(7);
    });

    it('should map valueQuantity.unit to the title of a linear scale', () => {
      const observation: SimpleObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: { value: 7, unit: 'unit' },
      };
      expect(mapper.map(observation).scale).toEqual({
        id: 'text',
        type: 'linear',
        title: { text: ['text', 'unit'] },
      });
    });

    it('should map referenceRange to an annotation', () => {
      const observation: SimpleObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: { value: 7, unit: 'unit' },
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
        category: [{ coding: [{ display: 'A' }] }, { coding: [{ display: 'B' }] }],
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: { value: 7, unit: 'unit' },
      };
      expect(mapper.map(observation).category).toEqual(['A', 'B']);
    });

    it('should add Home suffix for Observation with Measurement Setting extension', () => {
      const observation: SimpleObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: { value: 7, unit: 'unit' },
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
  });
});
