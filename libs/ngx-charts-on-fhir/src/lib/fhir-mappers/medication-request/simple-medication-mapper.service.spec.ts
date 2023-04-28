import { MedicationRequest } from 'fhir/r4';
import { SimpleMedication, SimpleMedicationMapper } from './simple-medication-mapper.service';

describe('SimpleMedicationMapper', () => {
  describe('canMap', () => {
    it('should return true for a SimpleMedication', () => {
      const medication: SimpleMedication = {
        resourceType: 'MedicationRequest',
        medicationCodeableConcept: { text: 'text' },
        authoredOn: new Date().toISOString(),
        intent: 'order',
        status: 'completed',
        subject: {},
      };
      const mapper = new SimpleMedicationMapper({});
      expect(mapper.canMap(medication)).toBe(true);
    });

    it('should return false for an Medication with no authoredOn', () => {
      const medication: MedicationRequest = {
        resourceType: 'MedicationRequest',
        medicationCodeableConcept: { text: 'text' },
        intent: 'order',
        status: 'completed',
        subject: {},
      };
      const mapper = new SimpleMedicationMapper({});
      expect(mapper.canMap(medication)).toBe(false);
    });
  });

  describe('map', () => {
    it('should map authoredOn time to x value in milliseconds', () => {
      const date = new Date();
      const medication: SimpleMedication = {
        resourceType: 'MedicationRequest',
        medicationCodeableConcept: { text: 'text' },
        authoredOn: date.toISOString(),
        intent: 'order',
        status: 'completed',
        subject: {},
      };
      const mapper = new SimpleMedicationMapper({});
      expect(mapper.map(medication).datasets[0].data[0].x).toEqual(date.getTime());
    });

    it('should map medicationCodeableConcept.text to y value', () => {
      const medication: SimpleMedication = {
        resourceType: 'MedicationRequest',
        medicationCodeableConcept: { text: 'text' },
        authoredOn: new Date().toISOString(),
        intent: 'order',
        status: 'completed',
        subject: {},
      };
      const mapper = new SimpleMedicationMapper({});
      expect(mapper.map(medication).datasets[0].data[0].y).toEqual('text');
    });

    it('should return a layer with a medication scale', () => {
      const medication: SimpleMedication = {
        resourceType: 'MedicationRequest',
        medicationCodeableConcept: { text: 'text' },
        authoredOn: new Date().toISOString(),
        intent: 'order',
        status: 'completed',
        subject: {},
      };
      const mapper = new SimpleMedicationMapper({ type: 'category' });
      expect(mapper.map(medication).scale).toEqual({
        id: 'medications',
        type: 'category',
        title: { text: ['Prescribed', 'Medications'] },
      });
    });
  });
});
