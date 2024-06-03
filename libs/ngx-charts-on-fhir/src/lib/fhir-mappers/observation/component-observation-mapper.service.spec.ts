import { Observation } from 'fhir/r4';
import { ComponentObservation, ComponentObservationMapper } from './component-observation-mapper.service';
import { TestBed } from '@angular/core/testing';
import { FhirCodeService } from '../fhir-code.service';
import { LINEAR_SCALE_OPTIONS, ANNOTATION_OPTIONS } from '../fhir-mapper-options';

describe('ComponentObservationMapper', () => {
  let mapper: ComponentObservationMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: LINEAR_SCALE_OPTIONS, useValue: { type: 'linear' } }, { provide: ANNOTATION_OPTIONS, useValue: { type: 'box' } }, FhirCodeService],
    });
    mapper = TestBed.inject(ComponentObservationMapper);
  });

  describe('canMap', () => {
    it('should return true for a ComponentObservation', () => {
      const observation: ComponentObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
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

    it('should return false for an Observation with no component', () => {
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
    it('should map each component to a dataset', () => {
      const observation: ComponentObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        effectiveDateTime: new Date().toISOString(),
        component: [
          {
            code: { text: 'one' },
            valueQuantity: { value: 7, unit: 'unit' },
          },
          {
            code: { text: 'two' },
            valueQuantity: { value: 8, unit: 'unit' },
          },
        ],
      };
      expect(mapper.map(observation).datasets).toEqual([
        jasmine.objectContaining({ label: 'one (Clinic)' }),
        jasmine.objectContaining({ label: 'two (Clinic)' }),
      ]);
    });

    it('should map effectiveDateTime to x value in milliseconds', () => {
      const date = new Date();
      const observation: ComponentObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        effectiveDateTime: date.toISOString(),
        component: [
          {
            code: { text: 'component' },
            valueQuantity: { value: 7, unit: 'unit' },
          },
        ],
      };
      expect(mapper.map(observation).datasets[0].data[0].x).toEqual(date.getTime());
    });

    it('should map valueQuantity.value to y value', () => {
      const observation: ComponentObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        effectiveDateTime: new Date().toISOString(),
        component: [
          {
            code: { text: 'component' },
            valueQuantity: { value: 7, unit: 'unit' },
          },
        ],
      };
      expect(mapper.map(observation).datasets[0].data[0].y).toEqual(7);
    });

    it('should map valueQuantity.code to the title of a linear scale', () => {
      const observation: ComponentObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        effectiveDateTime: new Date().toISOString(),
        component: [
          {
            code: { text: 'component' },
            valueQuantity: { value: 7, unit: 'unit', code: 'unit' },
          },
        ],
      };
      expect(mapper.map(observation).scale).toEqual(
        jasmine.objectContaining({
          id: 'text',
          type: 'linear',
          title: { text: ['text', 'unit'] },
        })
      );
    });

    it('should map referenceRange to an annotation', () => {
      const observation: ComponentObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        effectiveDateTime: new Date().toISOString(),
        component: [
          {
            code: { text: 'component' },
            valueQuantity: { value: 7, unit: 'unit' },
            referenceRange: [
              {
                low: { value: 1 },
                high: { value: 10 },
              },
            ],
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
      const observation: ComponentObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        category: [{ coding: [{ code: 'A' }] }, { coding: [{ code: 'B' }] }],
        effectiveDateTime: new Date().toISOString(),
        component: [
          {
            code: { text: 'component' },
            valueQuantity: { value: 7, unit: 'unit' },
          },
        ],
      };
      expect(mapper.map(observation).category).toEqual(['A', 'B']);
    });

    it('should use custom layer name as axis label', () => {
      const observation: ComponentObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        effectiveDateTime: new Date().toISOString(),
        component: [
          {
            code: { text: 'component' },
            valueQuantity: { value: 7, unit: 'unit' },
          },
        ],
      };
      expect((mapper.map(observation, 'custom').scale as any).title.text[0]).toBe('custom');
    });
  });
});
