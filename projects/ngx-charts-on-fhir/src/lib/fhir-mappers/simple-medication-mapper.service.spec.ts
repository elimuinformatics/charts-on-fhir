import { Medication, MedicationOrder, Observation } from 'fhir/r2';
import { SimpleMedication, SimpleMedicationMapper } from './simple-medication-mapper.service';

describe('SimpleMedicationMapper', () => {
  describe('canMap', () => {
    it('should return true for a SimpleMedication', () => {
      const medication: SimpleMedication = {
        resourceType: 'MedicationOrder',
        medicationCodeableConcept: { text: 'text' },
        dateWritten: new Date().toISOString(),
      };
      const mapper = new SimpleMedicationMapper({}, {});
      expect(mapper.canMap(medication)).toBe(true);
    });

    it('should return false for an Medication with no dateWritten', () => {
      const medication: MedicationOrder = {
        resourceType: 'MedicationOrder',
        medicationCodeableConcept: { text: 'text' },
      };
      const mapper = new SimpleMedicationMapper({}, {});
      expect(mapper.canMap(medication)).toBe(false);
    });
  });

  describe('map', () => {
    it('should map dateWritten time to x value in milliseconds', () => {
      const date = new Date();
      const medication: SimpleMedication = {
        resourceType: 'MedicationOrder',
        medicationCodeableConcept: { text: 'text' },
        dateWritten: date.toISOString(),
      };
      const mapper = new SimpleMedicationMapper({}, {});
      expect(mapper.map(medication).datasets[0].data[0].x).toEqual(date.getTime());
    });

    it('should map medicationCodeableConcept.text to y value', () => {
      const medication: SimpleMedication = {
        resourceType: 'MedicationOrder',
        medicationCodeableConcept: { text: 'text' },
        dateWritten: new Date().toISOString(),
      };
      const mapper = new SimpleMedicationMapper({}, {});
      expect(mapper.map(medication).datasets[0].data[0].y).toEqual('text');
    });

    it('should return a layer with a timeline scale', () => {
      const medication: SimpleMedication = {
        resourceType: 'MedicationOrder',
        medicationCodeableConcept: { text: 'text' },
        dateWritten: new Date().toISOString(),
      };
      const mapper = new SimpleMedicationMapper({ type: 'time' }, {});
      expect(mapper.map(medication).scales?.['timeline']).toEqual({ type: 'time' });
    });
  });
});
