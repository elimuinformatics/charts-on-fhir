import { Injectable } from '@angular/core';
import { Dosage, MedicationRequest } from 'fhir/r4';
import { DataLayer } from '../../data-layer/data-layer';
import { Mapper } from '../multi-mapper.service';
import { MILLISECONDS_PER_DAY, formatDate } from '../../utils';
import { SimpleMedication, isMedication, SimpleMedicationMapper, MedicationDataPoint } from './simple-medication-mapper.service';

export type BoundsDurationMedication = {
  dosageInstruction: [
    {
      timing: {
        repeat: {
          boundsDuration: {
            code: string;
            value: number;
          };
        };
      };
    }
  ];
} & SimpleMedication;

export function isBoundsDurationMedication(resource: MedicationRequest): resource is BoundsDurationMedication {
  return (
    isMedication(resource) &&
    resource.dosageInstruction?.length === 1 &&
    resource.dosageInstruction[0].timing?.repeat?.boundsDuration?.value != null &&
    resource.dosageInstruction[0].timing.repeat.boundsDuration.code === 'd'
  );
}

export type BoundsPeriodMedication = {
  dosageInstruction: [
    {
      timing: {
        repeat: {
          boundsPeriod: {
            start: string;
            end: string;
          };
        };
      };
    }
  ];
} & SimpleMedication;

export function isBoundsPeriodMedication(resource: MedicationRequest): resource is BoundsPeriodMedication {
  return (
    isMedication(resource) &&
    resource.dosageInstruction?.length === 1 &&
    resource.dosageInstruction[0].timing?.repeat?.boundsPeriod?.start != null &&
    resource.dosageInstruction[0].timing?.repeat?.boundsPeriod?.end != null
  );
}

export type ExpectedSupplyMedication = {
  dispenseRequest: {
    expectedSupplyDuration: {
      code: string;
      value: number;
    };
  };
} & SimpleMedication;

export function isExpectedSupplyMedication(resource: MedicationRequest): resource is ExpectedSupplyMedication {
  return (
    isMedication(resource) && //
    resource.dispenseRequest?.expectedSupplyDuration?.value != null &&
    resource.dispenseRequest.expectedSupplyDuration.code === 'd'
  );
}

export type TimingMedication = {
  dosageInstruction: [
    {
      doseAndRate: [
        {
          doseQuantity: {
            value: number;
            code: string;
          };
        }
      ];
    } & Dosage
  ];
  dispenseRequest: {
    initialFill: {
      quantity: {
        value: number;
        code: string;
      };
    };
  };
} & SimpleMedication;

export function isTimingMedication(resource: MedicationRequest): resource is TimingMedication {
  return (
    isMedication(resource) &&
    resource.dosageInstruction?.length === 1 &&
    resource.dosageInstruction[0].doseAndRate?.[0].doseQuantity?.value != null &&
    resource.dosageInstruction[0].doseAndRate[0].doseQuantity.code != null &&
    resource.dosageInstruction[0].doseAndRate[0].doseQuantity.code === resource.dispenseRequest?.initialFill?.quantity?.code &&
    resource.dispenseRequest?.initialFill?.quantity?.value != null
  );
}

export type TimingScheduleMedication = {
  dosageInstruction: [
    {
      timing: {
        repeat: {
          frequency: number;
          period: number;
          periodUnit: 'd' | 'h' | 'wk';
        };
      };
    } & TimingMedication['dosageInstruction'][0]
  ];
} & TimingMedication;

export function isTimingScheduleMedication(resource: MedicationRequest): resource is TimingScheduleMedication {
  return (
    isTimingMedication(resource) &&
    resource.dosageInstruction[0].timing?.repeat?.frequency != null &&
    resource.dosageInstruction[0].timing.repeat.period != null &&
    resource.dosageInstruction[0].timing.repeat.periodUnit?.match(/^(d|h|wk)$/) != null
  );
}

export type TimingCodeMedication = {
  dosageInstruction: [
    {
      timing: {
        code: {
          coding: {
            system: string;
            code: string;
          }[];
        };
      };
    } & TimingMedication['dosageInstruction'][0]
  ];
} & TimingMedication;

export const timingAbbreviationCodeSystem = 'http://terminology.hl7.org/CodeSystem/v3-GTSAbbreviation';

export function isTimingCodeMedication(resource: MedicationRequest): resource is TimingCodeMedication {
  return (
    isTimingMedication(resource) && //
    resource.dosageInstruction[0].timing?.code?.coding != null &&
    resource.dosageInstruction[0].timing.code.coding.some(({ code, system }) => code != null && system === timingAbbreviationCodeSystem)
  );
}

export type TimingTextMedication = {
  dosageInstruction: [
    {
      timing: {
        code: {
          text: string;
        };
      };
    } & TimingMedication['dosageInstruction'][0]
  ];
} & TimingMedication;

export function isTimingTextMedication(resource: MedicationRequest): resource is TimingTextMedication {
  return (
    isTimingMedication(resource) && //
    resource.dosageInstruction[0].timing?.code?.text === 'daily'
  );
}

export type DurationMedication =
  | BoundsDurationMedication
  | BoundsPeriodMedication
  | ExpectedSupplyMedication
  | TimingScheduleMedication
  | TimingCodeMedication
  | TimingTextMedication;

export function isDurationMedication(resource: MedicationRequest): resource is DurationMedication {
  return (
    isBoundsDurationMedication(resource) ||
    isBoundsPeriodMedication(resource) ||
    isExpectedSupplyMedication(resource) ||
    isTimingScheduleMedication(resource) ||
    isTimingCodeMedication(resource) ||
    isTimingTextMedication(resource)
  );
}

/**
 * Maps a FHIR MedicationRequest resource for which the supply duration can be calculated using one the supported algorthims.
 */
@Injectable({
  providedIn: 'root',
})
export class DurationMedicationMapper implements Mapper<DurationMedication> {
  constructor(private baseMapper: SimpleMedicationMapper) {}
  canMap = isDurationMedication;
  map(resource: DurationMedication): DataLayer<'bar', MedicationDataPoint[]> {
    const duration = computeDuration(resource);
    const durationDays = Math.round(duration / MILLISECONDS_PER_DAY);
    const authoredOn = new Date(resource.authoredOn).getTime();
    const endDate = authoredOn + duration;
    const layer = this.baseMapper.map(resource) as DataLayer<'bar', MedicationDataPoint[]>;
    layer.datasets = layer.datasets.map((dataset) => ({
      ...dataset,
      label: dataset.label + ' (Est. Duration)',
      type: 'bar',
      borderWidth: 1,
      borderSkipped: false,
      barPercentage: 1,
      grouped: false,
      data: [
        {
          x: [authoredOn, endDate],
          y: dataset.data[0].y,
          authoredOn,
          tooltip: [`Prescribed: ${formatDate(authoredOn)}`, `Est. supply: ${durationDays} days`, `Est. end date: ${formatDate(endDate)}`],
        },
      ],
    }));
    return layer;
  }
}

/** Compute the expected medication supply duration (in milliseconds) */
function computeDuration(resource: DurationMedication): number {
  if (isBoundsDurationMedication(resource)) {
    return resource.dosageInstruction[0].timing.repeat.boundsDuration.value * MILLISECONDS_PER_DAY;
  } else if (isBoundsPeriodMedication(resource)) {
    const { start, end } = resource.dosageInstruction[0].timing.repeat.boundsPeriod;
    return new Date(end).getTime() - new Date(start).getTime();
  } else if (isExpectedSupplyMedication(resource)) {
    const duration = resource.dispenseRequest.expectedSupplyDuration.value * MILLISECONDS_PER_DAY;
    const repeats = resource.dispenseRequest.numberOfRepeatsAllowed ?? 1;
    return duration * repeats;
  } else if (isTimingMedication(resource)) {
    const dailyFrequency = computeDailyFrequency(resource);
    const quantityEachTime = resource.dosageInstruction[0].doseAndRate[0].doseQuantity.value;
    const quantitySupplied = resource.dispenseRequest.initialFill.quantity.value;
    return (quantitySupplied / (quantityEachTime * dailyFrequency)) * MILLISECONDS_PER_DAY;
  }
  throw new TypeError('Cannot compute duration for this MedicationRequest');
}

function computeDailyFrequency(resource: TimingMedication) {
  if (isTimingScheduleMedication(resource)) {
    const { frequency, period, periodUnit } = resource.dosageInstruction[0].timing.repeat;
    switch (periodUnit.toLowerCase()) {
      case 'h': // hourly
        return frequency * (24 / period);
      case 'd': // daily
        return frequency / period;
      case 'wk': // weekly
        return frequency / (7 * period);
    }
  } else if (isTimingCodeMedication(resource)) {
    const timingCodeFrequency: Record<string, number> = {
      bid: 2,
      tid: 3,
      qid: 4,
      qd: 1,
      qod: 0.5,
      am: 1,
      pm: 1,
      q1h: 24,
      q2h: 12,
      q3h: 8,
      q4h: 6,
      q6h: 4,
      q8h: 3,
      bed: 1,
      week: 1 / 7,
      mo: 1 / 30,
    };
    const coding = resource.dosageInstruction[0].timing.code.coding.find(({ system }) => system === timingAbbreviationCodeSystem);
    if (coding?.code && timingCodeFrequency[coding.code] != null) {
      return timingCodeFrequency[coding.code];
    }
  } else if (isTimingTextMedication(resource)) {
    if (resource.dosageInstruction[0].timing.code.text === 'daily') {
      return 1;
    }
  }
  throw new TypeError(`Unsupported MedicationRequest Timing: ${JSON.stringify(resource.dosageInstruction[0].timing)}`);
}
