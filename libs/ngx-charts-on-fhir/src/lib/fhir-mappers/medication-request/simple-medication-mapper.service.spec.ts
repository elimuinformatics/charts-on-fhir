import { MedicationRequest } from 'fhir/r4';
import { SimpleMedication, SimpleMedicationMapper } from './simple-medication-mapper.service';
import { TestBed } from '@angular/core/testing';
import { FhirCodeService } from '../fhir-code.service';
import { CATEGORY_SCALE_OPTIONS } from '../fhir-mapper-options';
import { Chart } from 'chart.js';

describe('SimpleMedicationMapper', () => {
  let mapper: SimpleMedicationMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: CATEGORY_SCALE_OPTIONS, useValue: { type: 'category' } }, SimpleMedicationMapper, FhirCodeService],
    });
    mapper = TestBed.inject(SimpleMedicationMapper);
  });

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
      expect(mapper.canMap(medication)).toBe(false);
    });
  });

  describe('map', () => {
    it('should return a layer with medication category', () => {
      const date = new Date();
      const medication: SimpleMedication = {
        resourceType: 'MedicationRequest',
        medicationCodeableConcept: { text: 'text' },
        authoredOn: date.toISOString(),
        intent: 'order',
        status: 'completed',
        subject: {},
      };
      expect(mapper.map(medication).category?.[0]).toEqual('medication');
    });

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
      expect(mapper.map(medication).scale).toEqual({
        id: 'medications',
        type: 'category',
        title: { text: ['Prescribed', 'Medications'] },
      });
    });
  });

  describe('registerCustomPlugin', () => {
    it('should register custom plugin with id "customLabels"', () => {
      spyOn(Chart, 'register');
      mapper.registerCustomPlugin();
      expect(Chart.register).toHaveBeenCalledWith({
        id: 'customLabels',
        afterDatasetsDraw: jasmine.any(Function),
      });
    });

    it('should register custom plugin and invoke afterDatasetsDraw function', () => {
      const mockChart: any = {
        ctx: {
          fillStyle: 'black',
          font: '14px Arial',
          textAlign: 'start',
          textBaseline: 'middle',
          fillText: jasmine.createSpy('fillText'),
        },
        data: {
          datasets: [
            {
              label: 'TestLabel',
            },
          ],
        },
        getDatasetMeta: jasmine.createSpy('getDatasetMeta').and.returnValue({
          yAxisID: 'medications',
          data: [{ y: 10 }, { y: 20 }],
        }),
        chartArea: {
          left: 50,
        },
        afterDatasetsDraw: () => {},
      };

      spyOn(Chart, 'register').and.callFake((plugin) => {
        if ((plugin as any).id === 'customLabels') {
          (plugin as any).afterDatasetsDraw(mockChart);
        }
      });
      mapper.registerCustomPlugin();
      expect(mockChart.ctx.fillText).toHaveBeenCalledWith('TestLabel', 50, 15);
    });
  });
});
