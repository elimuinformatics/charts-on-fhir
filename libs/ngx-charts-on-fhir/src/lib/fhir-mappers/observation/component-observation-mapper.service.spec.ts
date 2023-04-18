import { Observation } from 'fhir/r4';
import { ComponentObservation, ComponentObservationMapper } from './component-observation-mapper.service';

describe('ComponentObservationMapper', () => {
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
      const mapper = new ComponentObservationMapper({}, {}, {});
      expect(mapper.canMap(observation)).toBe(true);
    });

    it('should return false for an Observation with no component', () => {
      const observation: Observation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        effectiveDateTime: new Date().toISOString(),
      };
      const mapper = new ComponentObservationMapper({}, {}, {});
      expect(mapper.canMap(observation)).toBe(false);
    });
  });

  describe('map', () => {
    it('should map each component to a dataset with Clinic label with suffix', () => {
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
      const mapper = new ComponentObservationMapper({}, {}, {});
      expect(mapper.map(observation).datasets).toEqual([
        jasmine.objectContaining({ label: 'one (Clinic)' }),
        jasmine.objectContaining({ label: 'two (Clinic)' }),
      ]);
    });

    it('should map each component to a dataset with Home label with suffix', () => {
      const observation: ComponentObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        effectiveDateTime: new Date().toISOString(),
        extension: [
          {
            url: 'http://hl7.org/fhir/us/vitals/StructureDefinition/MeasurementSettingExt',
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '264362003',
                  display: 'Home (environment)',
                },
              ],
            },
          },
        ],
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
      const mapper = new ComponentObservationMapper({}, {}, {});
      expect(mapper.map(observation).datasets).toEqual([jasmine.objectContaining({ label: 'one (Home)' }), jasmine.objectContaining({ label: 'two (Home)' })]);
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
      const mapper = new ComponentObservationMapper({}, {}, {});
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
      const mapper = new ComponentObservationMapper({}, {}, {});
      expect(mapper.map(observation).datasets[0].data[0].y).toEqual(7);
    });

    it('should map valueQuantity.unit to the title of a linear scale', () => {
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
      const mapper = new ComponentObservationMapper({}, { type: 'linear' }, {});
      expect(mapper.map(observation).scale).toEqual(
        jasmine.objectContaining({
          id: 'text (unit)',
          type: 'linear',
          title: { text: 'text (unit)' },
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
      const mapper = new ComponentObservationMapper({}, {}, { type: 'box' });
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
      const observation: ComponentObservation = {
        resourceType: 'Observation',
        status: 'final',
        code: { text: 'text' },
        category: [{ coding: [{ display: 'A' }] }, { coding: [{ display: 'B' }] }],
        effectiveDateTime: new Date().toISOString(),
        component: [
          {
            code: { text: 'component' },
            valueQuantity: { value: 7, unit: 'unit' },
          },
        ],
      };
      const mapper = new ComponentObservationMapper({}, {}, {});
      expect(mapper.map(observation).category).toEqual(['A', 'B']);
    });
  });
});
