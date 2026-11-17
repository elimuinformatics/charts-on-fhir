import { TestBed } from '@angular/core/testing';
import { CATEGORY_SCALE_OPTIONS, TIME_SCALE_OPTIONS } from '../fhir-mapper-options';
import {
  BoundsDurationMedication,
  BoundsPeriodMedication,
  ExpectedSupplyMedication,
  DurationMedicationMapper,
  TimingScheduleMedication,
  TimingCodeMedication,
  TimingTextMedication,
  timingAbbreviationCodeSystem,
} from './duration-medication-mapper.service';
import { SimpleMedicationMapper } from './simple-medication-mapper.service';
import { FhirCodeService } from '../fhir-code.service';
import { MedicationRequest } from 'fhir/r4';
import { MILLISECONDS_PER_DAY, formatDate } from '../../utils';

const basicMedication = {
  resourceType: 'MedicationRequest',
  medicationCodeableConcept: { text: 'text' },
  authoredOn: '2023-01-01T00:00:00Z',
  intent: 'order',
  status: 'completed',
  subject: {},
} as const;

describe('DurationMedicationMapper', () => {
  let mapper: DurationMedicationMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DurationMedicationMapper,
        SimpleMedicationMapper,
        { provide: TIME_SCALE_OPTIONS, useValue: {} },
        { provide: CATEGORY_SCALE_OPTIONS, useValue: {} },
        FhirCodeService,
      ],
    });

    mapper = TestBed.inject(DurationMedicationMapper);
  });

  describe('canMap', () => {
    it('should return true for a BoundsDurationMedication', () => {
      const medication: BoundsDurationMedication = {
        ...basicMedication,
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsDuration: {
                  code: 'd',
                  value: 30,
                },
              },
            },
          },
        ],
      };
      expect(mapper.canMap(medication)).toBe(true);
    });

    it('should return false if boundsDuration is not specified in days', () => {
      const medication: BoundsDurationMedication = {
        ...basicMedication,
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsDuration: {
                  code: 'mo',
                  value: 3,
                },
              },
            },
          },
        ],
      };
      expect(mapper.canMap(medication)).toBe(false);
    });

    it('should return true for a BoundsPeriodMedication', () => {
      const medication: BoundsPeriodMedication = {
        ...basicMedication,
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: '2023-01-01T00:00:00Z',
                  end: '2023-01-31T00:00:00Z',
                },
              },
            },
          },
        ],
      };
      expect(mapper.canMap(medication)).toBe(true);
    });

    it('should return false for a BoundsPeriodMedication less than 24hr', () => {
      const medication: BoundsPeriodMedication = {
        ...basicMedication,
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: '2023-01-01T00:00:00Z',
                  end: '2023-01-01T00:00:00Z',
                },
              },
            },
          },
        ],
      };
      expect(mapper.canMap(medication)).toBe(false);
    });

    it('should return true for an ExpectedSupplyMedication', () => {
      const medication: ExpectedSupplyMedication = {
        ...basicMedication,
        dispenseRequest: {
          expectedSupplyDuration: {
            code: 'd',
            value: 90,
          },
        },
      };
      expect(mapper.canMap(medication)).toBe(true);
    });

    it('should return false if expectedSupplyDuration is not specified in days', () => {
      const medication: ExpectedSupplyMedication = {
        ...basicMedication,
        dispenseRequest: {
          expectedSupplyDuration: {
            code: 'mo',
            value: 3,
          },
        },
      };
      expect(mapper.canMap(medication)).toBe(false);
    });

    it('should return true for a TimingScheduleMedication', () => {
      const medication: TimingScheduleMedication = {
        ...basicMedication,
        dosageInstruction: [
          {
            timing: {
              repeat: {
                frequency: 1,
                period: 1,
                periodUnit: 'd',
              },
            },
            doseAndRate: [
              {
                doseQuantity: {
                  value: 10,
                  code: 'mg',
                },
              },
            ],
          },
        ],
        dispenseRequest: {
          initialFill: {
            quantity: {
              value: 100,
              code: 'mg',
            },
          },
        },
      };
      expect(mapper.canMap(medication)).toBe(true);
    });

    it('should return true for a TimingCodeMedication', () => {
      const medication: TimingCodeMedication = {
        ...basicMedication,
        dosageInstruction: [
          {
            timing: {
              code: {
                coding: [
                  {
                    system: timingAbbreviationCodeSystem,
                    code: 'qd',
                  },
                ],
              },
            },
            doseAndRate: [
              {
                doseQuantity: {
                  value: 10,
                  code: 'mg',
                },
              },
            ],
          },
        ],
        dispenseRequest: {
          initialFill: {
            quantity: {
              value: 100,
              code: 'mg',
            },
          },
        },
      };
      expect(mapper.canMap(medication)).toBe(true);
    });

    it('should return true for a TimingTextMedication', () => {
      const medication: TimingTextMedication = {
        ...basicMedication,
        dosageInstruction: [
          {
            timing: {
              code: {
                text: 'daily',
              },
            },
            doseAndRate: [
              {
                doseQuantity: {
                  value: 10,
                  code: 'mg',
                },
              },
            ],
          },
        ],
        dispenseRequest: {
          initialFill: {
            quantity: {
              value: 100,
              code: 'mg',
            },
          },
        },
      };
      expect(mapper.canMap(medication)).toBe(true);
    });
  });

  describe('map', () => {
    it('should compute duration for a BoundsDurationMedication', () => {
      const medication: BoundsDurationMedication = {
        ...basicMedication,
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsDuration: {
                  code: 'd',
                  value: 30,
                },
              },
            },
          },
        ],
      };
      const expectedStartDate = new Date(medication.authoredOn).getTime();
      const expectedEndDate = new Date('2023-01-31T00:00:00Z').getTime();
      expect(mapper.map(medication).datasets[0].data[0].x).toEqual([expectedStartDate, expectedEndDate]);
    });

    it('should compute duration for a BoundsPeriodMedication', () => {
      const medication: BoundsPeriodMedication = {
        ...basicMedication,
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsPeriod: {
                  start: '2023-01-01T00:00:00Z',
                  end: '2023-01-31T00:00:00Z',
                },
              },
            },
          },
        ],
      };
      const expectedStartDate = new Date(medication.authoredOn).getTime();
      const expectedEndDate = new Date('2023-01-31T00:00:00Z').getTime();
      expect(mapper.map(medication).datasets[0].data[0].x).toEqual([expectedStartDate, expectedEndDate]);
    });

    it('should compute duration for an ExpectedSupplyMedication', () => {
      const medication: ExpectedSupplyMedication = {
        ...basicMedication,
        dispenseRequest: {
          expectedSupplyDuration: {
            code: 'd',
            value: 30,
          },
        },
      };
      const expectedStartDate = new Date(medication.authoredOn).getTime();
      const expectedEndDate = new Date('2023-01-31T00:00:00Z').getTime();
      expect(mapper.map(medication).datasets[0].data[0].x).toEqual([expectedStartDate, expectedEndDate]);
    });

    it('should compute duration for a daily TimingScheduleMedication', () => {
      const medication: TimingScheduleMedication = {
        ...basicMedication,
        dosageInstruction: [
          {
            timing: {
              repeat: {
                frequency: 1,
                period: 1,
                periodUnit: 'd',
              },
            },
            doseAndRate: [
              {
                doseQuantity: {
                  value: 10,
                  code: 'mg',
                },
              },
            ],
          },
        ],
        dispenseRequest: {
          initialFill: {
            quantity: {
              value: 300,
              code: 'mg',
            },
          },
        },
      };
      const expectedStartDate = new Date(medication.authoredOn).getTime();
      const expectedEndDate = new Date('2023-01-31T00:00:00Z').getTime();
      expect(mapper.map(medication).datasets[0].data[0].x).toEqual([expectedStartDate, expectedEndDate]);
    });

    it('should compute duration for an hourly TimingScheduleMedication', () => {
      const medication: TimingScheduleMedication = {
        ...basicMedication,
        dosageInstruction: [
          {
            timing: {
              repeat: {
                frequency: 1,
                period: 24,
                periodUnit: 'h',
              },
            },
            doseAndRate: [
              {
                doseQuantity: {
                  value: 10,
                  code: 'mg',
                },
              },
            ],
          },
        ],
        dispenseRequest: {
          initialFill: {
            quantity: {
              value: 300,
              code: 'mg',
            },
          },
        },
      };
      const expectedStartDate = new Date(medication.authoredOn).getTime();
      const expectedEndDate = new Date('2023-01-31T00:00:00Z').getTime();
      expect(mapper.map(medication).datasets[0].data[0].x).toEqual([expectedStartDate, expectedEndDate]);
    });

    it('should compute duration for a weekly TimingScheduleMedication', () => {
      const medication: TimingScheduleMedication = {
        ...basicMedication,
        dosageInstruction: [
          {
            timing: {
              repeat: {
                frequency: 7,
                period: 1,
                periodUnit: 'wk',
              },
            },
            doseAndRate: [
              {
                doseQuantity: {
                  value: 10,
                  code: 'mg',
                },
              },
            ],
          },
        ],
        dispenseRequest: {
          initialFill: {
            quantity: {
              value: 300,
              code: 'mg',
            },
          },
        },
      };
      const expectedStartDate = new Date(medication.authoredOn).getTime();
      const expectedEndDate = new Date('2023-01-31T00:00:00Z').getTime();
      expect(mapper.map(medication).datasets[0].data[0].x).toEqual([expectedStartDate, expectedEndDate]);
    });

    it('should compute duration for a TimingCodeMedication', () => {
      const medication: TimingCodeMedication = {
        ...basicMedication,
        dosageInstruction: [
          {
            timing: {
              code: {
                coding: [
                  {
                    system: 'http://www.example.com/proprietary-code-system',
                    code: 'never',
                  },
                  {
                    system: timingAbbreviationCodeSystem,
                    code: 'qd',
                  },
                ],
              },
            },
            doseAndRate: [
              {
                doseQuantity: {
                  value: 10,
                  code: 'mg',
                },
              },
            ],
          },
        ],
        dispenseRequest: {
          initialFill: {
            quantity: {
              value: 300,
              code: 'mg',
            },
          },
        },
      };
      const expectedStartDate = new Date(medication.authoredOn).getTime();
      const expectedEndDate = new Date('2023-01-31T00:00:00Z').getTime();
      expect(mapper.map(medication).datasets[0].data[0].x).toEqual([expectedStartDate, expectedEndDate]);
    });

    it('should compute duration for a TimingCodeMedication with uppercase code', () => {
      const medication: TimingCodeMedication = {
        ...basicMedication,
        dosageInstruction: [
          {
            timing: {
              code: {
                coding: [
                  {
                    system: 'http://www.example.com/proprietary-code-system',
                    code: 'never',
                  },
                  {
                    system: timingAbbreviationCodeSystem,
                    code: 'QD',
                  },
                ],
              },
            },
            doseAndRate: [
              {
                doseQuantity: {
                  value: 10,
                  code: 'mg',
                },
              },
            ],
          },
        ],
        dispenseRequest: {
          initialFill: {
            quantity: {
              value: 300,
              code: 'mg',
            },
          },
        },
      };
      const expectedStartDate = new Date(medication.authoredOn).getTime();
      const expectedEndDate = new Date('2023-01-31T00:00:00Z').getTime();
      expect(mapper.map(medication).datasets[0].data[0].x).toEqual([expectedStartDate, expectedEndDate]);
    });

    it('should throw an error for invalid Timing code', () => {
      const medication: TimingCodeMedication = {
        ...basicMedication,
        dosageInstruction: [
          {
            timing: {
              code: {
                coding: [
                  {
                    system: timingAbbreviationCodeSystem,
                    code: 'never',
                  },
                ],
              },
            },
            doseAndRate: [
              {
                doseQuantity: {
                  value: 10,
                  code: 'mg',
                },
              },
            ],
          },
        ],
        dispenseRequest: {
          initialFill: {
            quantity: {
              value: 300,
              code: 'mg',
            },
          },
        },
      };
      expect(() => mapper.map(medication)).toThrowError();
      expect(mapper.canMap(medication)).toBe(false);
    });

    it('should throw an error if initialFill has a different quantity code', () => {
      const medication: TimingCodeMedication = {
        ...basicMedication,
        dosageInstruction: [
          {
            timing: {
              code: {
                coding: [
                  {
                    system: timingAbbreviationCodeSystem,
                    code: 'qd',
                  },
                ],
              },
            },
            doseAndRate: [
              {
                doseQuantity: {
                  value: 10,
                  code: 'mg',
                },
              },
            ],
          },
        ],
        dispenseRequest: {
          initialFill: {
            quantity: {
              value: 1,
              code: 'g',
            },
          },
        },
      };
      expect(() => mapper.map(medication)).toThrowError();
    });

    it('should compute duration for a TimingTextMedication', () => {
      const medication: TimingTextMedication = {
        ...basicMedication,
        dosageInstruction: [
          {
            timing: {
              code: { text: 'daily' },
            },
            doseAndRate: [
              {
                doseQuantity: {
                  value: 10,
                  code: 'mg',
                },
              },
            ],
          },
        ],
        dispenseRequest: {
          initialFill: {
            quantity: {
              value: 300,
              code: 'mg',
            },
          },
        },
      };
      const expectedStartDate = new Date(medication.authoredOn).getTime();
      const expectedEndDate = new Date('2023-01-31T00:00:00Z').getTime();
      expect(mapper.map(medication).datasets[0].data[0].x).toEqual([expectedStartDate, expectedEndDate]);
    });

    it('should compute duration for a TimingTextMedication with uppercase text', () => {
      const medication: TimingTextMedication = {
        ...basicMedication,
        dosageInstruction: [
          {
            timing: {
              code: { text: 'Daily' },
            },
            doseAndRate: [
              {
                doseQuantity: {
                  value: 10,
                  code: 'mg',
                },
              },
            ],
          },
        ],
        dispenseRequest: {
          initialFill: {
            quantity: {
              value: 300,
              code: 'mg',
            },
          },
        },
      };
      const expectedStartDate = new Date(medication.authoredOn).getTime();
      const expectedEndDate = new Date('2023-01-31T00:00:00Z').getTime();
      expect(mapper.map(medication).datasets[0].data[0].x).toEqual([expectedStartDate, expectedEndDate]);
    });

    it('should include an authoredOn property on each data point', () => {
      const medication: BoundsDurationMedication = {
        ...basicMedication,
        authoredOn: '2023-01-01T00:00:00Z',
        dosageInstruction: [
          {
            timing: {
              repeat: {
                boundsDuration: {
                  code: 'd',
                  value: 30,
                },
              },
            },
          },
        ],
      };
      const expectedDate = new Date(medication.authoredOn).getTime();
      expect(mapper.map(medication).datasets[0].data[0].authoredOn).toEqual(expectedDate);
    });
  });
  describe('supply bars and stopped orders', () => {
    const authoredOn = new Date('2023-01-01T00:00:00Z').getTime();
    const day = (n: number) => authoredOn + n * MILLISECONDS_PER_DAY;

    /** Shaped like a Cerner order: dispensed amount in `dispenseRequest.quantity`, frequency as a GTS abbreviation code */
    function cernerOrder(options: {
      dose: number;
      unit: string;
      timingCode: string;
      quantity: number;
      refills: number;
      status?: MedicationRequest['status'];
      boundsEnd?: string;
    }): MedicationRequest {
      return {
        ...basicMedication,
        status: options.status ?? 'active',
        dosageInstruction: [
          {
            timing: {
              repeat: { boundsPeriod: { start: '2023-01-01T00:00:00Z', end: options.boundsEnd } },
              code: { coding: [{ system: timingAbbreviationCodeSystem, code: options.timingCode }] },
            },
            doseAndRate: [{ doseQuantity: { value: options.dose, code: options.unit } }],
          },
        ],
        dispenseRequest: {
          numberOfRepeatsAllowed: options.refills,
          quantity: { value: options.quantity, code: options.unit },
        },
      };
    }

    it('should map an order whose dispensed amount is only in dispenseRequest.quantity', () => {
      const medication = cernerOrder({ dose: 1, unit: '{tbl}', timingCode: 'QD', quantity: 90, refills: 0 });
      expect(mapper.canMap(medication)).toBe(true);
    });

    it('should draw one 90-day bar for 90 tablets taken once a day with no refills', () => {
      const medication = cernerOrder({ dose: 1, unit: '{tbl}', timingCode: 'QD', quantity: 90, refills: 0 });
      const data = mapper.map(medication as any).datasets[0].data;
      expect(data.map((point) => point.x)).toEqual([[authoredOn, day(90)]]);
    });

    it('should compute a 30-day supply for 540 mL taken as 6 mL three times a day', () => {
      const medication = cernerOrder({ dose: 6, unit: 'mL', timingCode: 'TID', quantity: 540, refills: 0 });
      const data = mapper.map(medication as any).datasets[0].data;
      expect(data.map((point) => point.x)).toEqual([[authoredOn, day(30)]]);
    });

    it('should draw the first fill and authorized refills as one bar', () => {
      const medication = cernerOrder({ dose: 1, unit: '{tbl}', timingCode: 'QD', quantity: 90, refills: 3 });
      const data = mapper.map(medication as any).datasets[0].data;
      expect(data.map((point) => point.x)).toEqual([[authoredOn, day(360)]]);
    });

    it('should describe the supply and refills in the tooltip', () => {
      const medication = cernerOrder({ dose: 1, unit: '{tbl}', timingCode: 'QD', quantity: 90, refills: 3 });
      const data = mapper.map(medication as any).datasets[0].data;
      expect(data[0].tooltip).toEqual([`Prescribed: ${formatDate(authoredOn)}`, `90-day supply + 3 refills (est. through ${formatDate(day(360))})`]);
    });

    it('should use initialFill.quantity for the first fill and quantity for each refill', () => {
      const medication = cernerOrder({ dose: 1, unit: '{tbl}', timingCode: 'QD', quantity: 90, refills: 1 });
      medication.dispenseRequest!.initialFill = { quantity: { value: 30, code: '{tbl}' } };
      const data = mapper.map(medication as any).datasets[0].data;
      expect(data.map((point) => point.x)).toEqual([[authoredOn, day(120)]]);
    });

    it('should draw only the first fill when the per-fill quantity is in a different unit', () => {
      const medication = cernerOrder({ dose: 1, unit: '{tbl}', timingCode: 'QD', quantity: 90, refills: 3 });
      medication.dispenseRequest!.initialFill = { quantity: { value: 30, code: '{tbl}' } };
      medication.dispenseRequest!.quantity = { value: 2, code: '{bottle}' };
      const data = mapper.map(medication as any).datasets[0].data;
      expect(data.map((point) => point.x)).toEqual([[authoredOn, day(30)]]);
    });

    it('should count the initial supply when numberOfRepeatsAllowed is 0', () => {
      const medication: ExpectedSupplyMedication = {
        ...basicMedication,
        dispenseRequest: {
          expectedSupplyDuration: { code: 'd', value: 30 },
          numberOfRepeatsAllowed: 0,
        },
      };
      const data = mapper.map(medication).datasets[0].data;
      expect(data.map((point) => point.x)).toEqual([[authoredOn, day(30)]]);
    });

    it('should add one supply period per refill to an expectedSupplyDuration order', () => {
      const medication: ExpectedSupplyMedication = {
        ...basicMedication,
        dispenseRequest: {
          expectedSupplyDuration: { code: 'd', value: 30 },
          numberOfRepeatsAllowed: 2,
        },
      };
      const data = mapper.map(medication).datasets[0].data;
      expect(data.map((point) => point.x)).toEqual([[authoredOn, day(90)]]);
    });

    it('should not map an order whose timing code has no known frequency', () => {
      const medication = cernerOrder({ dose: 1, unit: '{tbl}', timingCode: 'Q36H', quantity: 90, refills: 0 });
      expect(mapper.canMap(medication)).toBe(false);
    });

    it('should end a stopped order at its stop date and mark it stopped', () => {
      const stop = '2023-01-01T00:14:30Z';
      const medication = cernerOrder({ dose: 0.5, unit: '{tbl}', timingCode: 'BID', quantity: 180, refills: 0, status: 'stopped', boundsEnd: stop });
      const data = mapper.map(medication as any).datasets[0].data;
      expect(data.map((point) => point.x)).toEqual([[authoredOn, new Date(stop).getTime()]]);
      expect(data[0].stopped).toBe(true);
    });

    it('should show the stop date in the tooltip of a stopped order', () => {
      const stop = '2023-01-01T00:14:30Z';
      const medication = cernerOrder({ dose: 0.5, unit: '{tbl}', timingCode: 'BID', quantity: 180, refills: 0, status: 'stopped', boundsEnd: stop });
      const tooltip = mapper.map(medication as any).datasets[0].data[0].tooltip as string[];
      expect(tooltip[tooltip.length - 1]).toMatch(/^Stopped: /);
    });

    it('should read a date-only stop date as the end of that local day and show it without a time', () => {
      const medication = cernerOrder({ dose: 1, unit: '{tbl}', timingCode: 'QD', quantity: 90, refills: 0, status: 'stopped', boundsEnd: '2023-01-15' });
      const point = mapper.map(medication as any).datasets[0].data[0];
      const endOfDay = new Date(2023, 0, 15, 23, 59, 59, 999).getTime();
      expect(point.x).toEqual([authoredOn, endOfDay]);
      expect(point.tooltip).toContain(`Stopped: ${formatDate(endOfDay)}`);
    });

    it('should read a year-month stop date as the end of that local month', () => {
      const medication = cernerOrder({ dose: 1, unit: '{tbl}', timingCode: 'QD', quantity: 90, refills: 0, status: 'stopped', boundsEnd: '2023-02' });
      const point = mapper.map(medication as any).datasets[0].data[0];
      expect(point.x).toEqual([authoredOn, new Date(2023, 1, 28, 23, 59, 59, 999).getTime()]);
    });

    it('should not set minBarLength, which would clamp out-of-view bars into the plot area', () => {
      const medication = cernerOrder({
        dose: 0.5,
        unit: '{tbl}',
        timingCode: 'BID',
        quantity: 180,
        refills: 0,
        status: 'stopped',
        boundsEnd: '2023-01-01T00:14:30Z',
      });
      const dataset = mapper.map(medication as any).datasets[0] as any;
      expect(dataset.minBarLength).toBeUndefined();
    });

    it('should truncate the bar when the order is stopped during the refill period', () => {
      const medication = cernerOrder({
        dose: 1,
        unit: '{tbl}',
        timingCode: 'QD',
        quantity: 90,
        refills: 3,
        status: 'stopped',
        boundsEnd: '2023-05-11T00:00:00Z',
      });
      const data = mapper.map(medication as any).datasets[0].data;
      expect(data.map((point) => point.x)).toEqual([[authoredOn, day(130)]]);
      expect(data[0].stopped).toBe(true);
    });

    it('should keep the full supply when the order was stopped after the supply ran out', () => {
      const medication = cernerOrder({
        dose: 1,
        unit: '{tbl}',
        timingCode: 'QD',
        quantity: 30,
        refills: 0,
        status: 'stopped',
        boundsEnd: '2023-12-31T00:00:00Z',
      });
      const data = mapper.map(medication as any).datasets[0].data;
      expect(data.map((point) => point.x)).toEqual([[authoredOn, day(30)]]);
      expect(data[0].stopped).toBeUndefined();
    });

    it('should keep the full supply and say so in the tooltip when a stopped order has no stop date', () => {
      const medication = cernerOrder({ dose: 1, unit: '{tbl}', timingCode: 'QD', quantity: 30, refills: 0, status: 'stopped' });
      const data = mapper.map(medication as any).datasets[0].data;
      expect(data.map((point) => point.x)).toEqual([[authoredOn, day(30)]]);
      expect(data[0].stopped).toBeUndefined();
      expect(data[0].tooltip).toContain('Stopped (stop date not recorded)');
    });

    it('should mark a stopped order whose duration comes from its bounds period', () => {
      const medication: BoundsPeriodMedication = {
        ...basicMedication,
        status: 'stopped',
        dosageInstruction: [{ timing: { repeat: { boundsPeriod: { start: '2023-01-01T00:00:00Z', end: '2023-01-11T00:00:00Z' } } } }],
      };
      const data = mapper.map(medication).datasets[0].data;
      expect(data.map((point) => point.x)).toEqual([[authoredOn, day(10)]]);
      expect(data[0].stopped).toBe(true);
    });
  });
});
