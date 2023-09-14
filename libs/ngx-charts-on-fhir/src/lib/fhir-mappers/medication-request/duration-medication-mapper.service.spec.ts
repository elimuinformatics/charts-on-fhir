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
});
