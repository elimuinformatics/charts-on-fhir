import { Observation } from 'fhir/r4';
import { SimpleObservation, SimpleObservationMapper } from './simple-observation-mapper.service';

describe('SimpleObservationMapper', () => {
  describe('canMap', () => {
    it('should return true for a SimpleObservation', () => {
      const observation: SimpleObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: { value: 7, unit: 'unit' },
      };
      const mapper = new SimpleObservationMapper({}, {}, {});
      expect(mapper.canMap(observation)).toBe(true);
    });

    it('should return false for an Observation with no valueQuantity', () => {
      const observation: Observation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        effectiveDateTime: new Date().toISOString(),
      };
      const mapper = new SimpleObservationMapper({}, {}, {});
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
      const mapper = new SimpleObservationMapper({}, {}, {});
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
      const mapper = new SimpleObservationMapper({}, {}, {});
      expect(mapper.map(observation).datasets[0].data[0].y).toEqual(7);
    });

    it('should return a layer with a timeline scale', () => {
      const observation: SimpleObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: { value: 7, unit: 'unit' },
      };
      const mapper = new SimpleObservationMapper({ type: 'time' }, {}, {});
      expect(mapper.map(observation).scales?.['timeline']).toEqual({ type: 'time' });
    });

    it('should map valueQuantity.unit to the title of a linear scale', () => {
      const observation: SimpleObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: { value: 7, unit: 'unit' },
      };
      const mapper = new SimpleObservationMapper({}, { type: 'linear' }, {});
      expect(mapper.map(observation).scales?.['text (unit)']).toEqual({
        type: 'linear',
        title: { text: 'text (unit)' },
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
      const mapper = new SimpleObservationMapper({}, {}, { type: 'box' });
      expect(mapper.map(observation).annotations?.[0]).toEqual(
        jasmine.objectContaining({
          type: 'box',
          yScaleID: 'text (unit)',
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
      const mapper = new SimpleObservationMapper({}, {}, {});
      expect(mapper.map(observation).category).toEqual(['A', 'B']);
    });
  });
});
