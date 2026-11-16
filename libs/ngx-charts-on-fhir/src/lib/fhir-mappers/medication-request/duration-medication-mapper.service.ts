import { Injectable } from '@angular/core';
import { BarElement, Chart } from 'chart.js';
import { Dosage, MedicationRequest, Quantity } from 'fhir/r4';
import { DataLayer } from '../../data-layer/data-layer';
import { Mapper } from '../multi-mapper.service';
import { MILLISECONDS_PER_DAY, formatDate, formatDateTime } from '../../utils';
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
    },
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
    },
  ];
} & SimpleMedication;

export function isBoundsPeriodMedication(resource: MedicationRequest): resource is BoundsPeriodMedication {
  return (
    isMedication(resource) &&
    resource.dosageInstruction?.length === 1 &&
    resource.dosageInstruction[0].timing?.repeat?.boundsPeriod?.start != null &&
    resource.dosageInstruction[0].timing?.repeat?.boundsPeriod?.end != null &&
    new Date(resource.dosageInstruction[0].timing.repeat.boundsPeriod.end).getTime() -
      new Date(resource.dosageInstruction[0].timing.repeat.boundsPeriod.start).getTime() >=
      MILLISECONDS_PER_DAY
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

type CodedQuantity = {
  value: number;
  code: string;
};

/**
 * A MedicationRequest whose supply duration can be computed from the dose, the dosing frequency, and the amount dispensed.
 * The amount of the first fill comes from `dispenseRequest.initialFill.quantity` when present, otherwise from `dispenseRequest.quantity`.
 */
export type TimingMedication = {
  dosageInstruction: [
    {
      doseAndRate: [
        {
          doseQuantity: CodedQuantity;
        },
      ];
    } & Dosage,
  ];
  dispenseRequest: {
    initialFill?: {
      quantity?: Quantity;
    };
    quantity?: Quantity;
  };
} & SimpleMedication;

/** Amount dispensed in the first fill: `initialFill.quantity` when present, otherwise the per-fill `quantity` */
function firstFillQuantity(resource: MedicationRequest): Quantity | undefined {
  return resource.dispenseRequest?.initialFill?.quantity ?? resource.dispenseRequest?.quantity;
}

export function isTimingMedication(resource: MedicationRequest): resource is TimingMedication {
  const doseQuantity = resource.dosageInstruction?.[0]?.doseAndRate?.[0]?.doseQuantity;
  const fillQuantity = firstFillQuantity(resource);
  return (
    isMedication(resource) &&
    resource.dosageInstruction?.length === 1 &&
    doseQuantity?.value != null &&
    doseQuantity.code != null &&
    fillQuantity?.value != null &&
    fillQuantity.code === doseQuantity.code
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
    } & TimingMedication['dosageInstruction'][0],
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
    } & TimingMedication['dosageInstruction'][0],
  ];
} & TimingMedication;

export const timingAbbreviationCodeSystem = 'http://terminology.hl7.org/CodeSystem/v3-GTSAbbreviation';

/** Doses per day for the supported codes from `timingAbbreviationCodeSystem` */
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
  q12h: 2,
  bed: 1,
  week: 1 / 7,
  wk: 1 / 7,
  mo: 1 / 30,
};

/**
 * True when the timing has a code from `timingAbbreviationCodeSystem` with a known daily frequency.
 * A medication with an unknown code falls back to `SimpleMedicationMapper` instead of failing to map.
 */
export function isTimingCodeMedication(resource: MedicationRequest): resource is TimingCodeMedication {
  return (
    isTimingMedication(resource) && //
    resource.dosageInstruction[0].timing?.code?.coding != null &&
    resource.dosageInstruction[0].timing.code.coding.some(
      ({ code, system }) => code != null && system === timingAbbreviationCodeSystem && timingCodeFrequency[code.toLowerCase()] != null,
    )
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
    } & TimingMedication['dosageInstruction'][0],
  ];
} & TimingMedication;

export function isTimingTextMedication(resource: MedicationRequest): resource is TimingTextMedication {
  return (
    isTimingMedication(resource) && //
    resource.dosageInstruction[0].timing?.code?.text?.toLowerCase() === 'daily'
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

/** Smallest length, in pixels, of a duration bar, so an order stopped minutes after it was written is still visible */
const MIN_BAR_LENGTH_PX = 4;

/**
 * Maps a FHIR MedicationRequest resource for which the supply duration can be calculated using one the supported algorthims.
 *
 * The first fill is drawn as one data point. Authorized refills are drawn as a second data point with `segment: 'refill'`,
 * which `DataLayerColorService` fills with a hatched pattern. Refills are authorized, not dispensed, so the refill segment
 * is an estimate of the period the patient is meant to be on the medication.
 *
 * A `stopped` order is truncated at its stop date (`dosageInstruction[0].timing.repeat.boundsPeriod.end`), and the last
 * data point is flagged with `stopped: true` so the chart draws an end marker.
 */
@Injectable()
export class DurationMedicationMapper implements Mapper<DurationMedication> {
  constructor(private readonly baseMapper: SimpleMedicationMapper) {
    registerStoppedMarkerPlugin();
  }
  canMap = isDurationMedication;
  map(resource: DurationMedication): DataLayer<'bar', MedicationDataPoint[]> {
    const supply = computeSupply(resource);
    const authoredOn = new Date(resource.authoredOn).getTime();
    const firstFillEnd = authoredOn + supply.firstFill;
    const supplyEnd = firstFillEnd + supply.refills * supply.refill;
    const stoppedAt = computeStopTime(resource);
    // A bounds period already ends at the stop date, so a stopped bounds-period order is marked even though it is not shortened
    const truncated = stoppedAt != null && (stoppedAt < supplyEnd || supply.fromBoundsPeriod);
    const end = truncated ? Math.max(Math.min(stoppedAt, supplyEnd), authoredOn) : supplyEnd;
    const tooltip = buildTooltip(resource, authoredOn, supply, supplyEnd, stoppedAt);

    const layer = this.baseMapper.map(resource) as DataLayer<'bar', MedicationDataPoint[]>;
    layer.datasets = layer.datasets.map((dataset) => {
      const data: MedicationDataPoint[] = [
        {
          x: [authoredOn, Math.min(firstFillEnd, end)],
          y: dataset.data[0].y,
          authoredOn,
          tooltip,
          resource,
        },
      ];
      if (end > firstFillEnd) {
        data.push({
          x: [firstFillEnd, end],
          y: dataset.data[0].y,
          authoredOn,
          tooltip,
          resource,
          segment: 'refill',
        });
      }
      if (truncated) {
        data[data.length - 1].stopped = true;
      }
      return {
        ...dataset,
        label: dataset.label + ' (Est. Duration)',
        type: 'bar',
        borderWidth: 1,
        borderSkipped: false,
        barPercentage: 1,
        grouped: false,
        minBarLength: MIN_BAR_LENGTH_PX,
        data,
      };
    });

    return layer;
  }
}

/** Supply durations in milliseconds */
type Supply = {
  /** Duration of the first fill */
  firstFill: number;
  /** Duration of each refill */
  refill: number;
  /** Number of authorized refills */
  refills: number;
  /** True when the duration is the order's bounds period rather than an estimate of the supply */
  fromBoundsPeriod?: boolean;
};

/**
 * Compute the expected medication supply (in milliseconds).
 *
 * The bounds period of a stopped order ends at the stop date, so it says how long the order was active, not how long the supply lasts.
 * For a stopped order the supply-based algorithms are tried first, and the bounds period is used only when they do not apply.
 */
function computeSupply(resource: DurationMedication): Supply {
  if (isBoundsDurationMedication(resource)) {
    const duration = resource.dosageInstruction[0].timing.repeat.boundsDuration.value * MILLISECONDS_PER_DAY;
    return { firstFill: duration, refill: 0, refills: 0 };
  }
  const preferSupply = resource.status === 'stopped' && (isExpectedSupplyMedication(resource) || isSupportedTimingMedication(resource));
  if (isBoundsPeriodMedication(resource) && !preferSupply) {
    const { start, end } = resource.dosageInstruction[0].timing.repeat.boundsPeriod;
    return { firstFill: new Date(end).getTime() - new Date(start).getTime(), refill: 0, refills: 0, fromBoundsPeriod: true };
  } else if (isExpectedSupplyMedication(resource)) {
    const duration = resource.dispenseRequest.expectedSupplyDuration.value * MILLISECONDS_PER_DAY;
    return { firstFill: duration, refill: duration, refills: resource.dispenseRequest.numberOfRepeatsAllowed ?? 0 };
  } else if (isSupportedTimingMedication(resource)) {
    const dailyFrequency = computeDailyFrequency(resource);
    const doseQuantity = resource.dosageInstruction[0].doseAndRate[0].doseQuantity;
    const dailyQuantity = doseQuantity.value * dailyFrequency;
    const firstFill = firstFillQuantity(resource)!;
    const perFill = resource.dispenseRequest.quantity;
    const refillQuantity = perFill?.value != null && perFill.code === doseQuantity.code ? perFill.value : firstFill.value!;
    return {
      firstFill: (firstFill.value! / dailyQuantity) * MILLISECONDS_PER_DAY,
      refill: (refillQuantity / dailyQuantity) * MILLISECONDS_PER_DAY,
      refills: resource.dispenseRequest.numberOfRepeatsAllowed ?? 0,
    };
  }
  throw new TypeError('Cannot compute duration for this MedicationRequest');
}

/** Stop time (in milliseconds) of a `stopped` order, or `undefined` if the order is not stopped or the stop time is not recorded */
function computeStopTime(resource: MedicationRequest): number | undefined {
  if (resource.status !== 'stopped') {
    return undefined;
  }
  const end = resource.dosageInstruction?.[0]?.timing?.repeat?.boundsPeriod?.end;
  return end ? new Date(end).getTime() : undefined;
}

function buildTooltip(resource: MedicationRequest, authoredOn: number, supply: Supply, supplyEnd: number, stoppedAt: number | undefined): string[] {
  const days = Math.round(supply.firstFill / MILLISECONDS_PER_DAY);
  const refills = supply.refills > 0 ? ` + ${supply.refills} ${supply.refills === 1 ? 'refill' : 'refills'}` : '';
  const tooltip = [`Prescribed: ${formatDate(authoredOn)}`, `${days}-day supply${refills} (est. through ${formatDate(supplyEnd)})`];
  if (stoppedAt != null) {
    tooltip.push(`Stopped: ${formatDateTime(stoppedAt)}`);
  } else if (resource.status === 'stopped') {
    tooltip.push('Stopped (stop date not recorded)');
  }
  return tooltip;
}

/** True when the supply can be computed from the dose, a supported dosing frequency, and the amount dispensed */
function isSupportedTimingMedication(resource: MedicationRequest): resource is TimingMedication {
  return isTimingScheduleMedication(resource) || isTimingCodeMedication(resource) || isTimingTextMedication(resource);
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
    const coding = resource.dosageInstruction[0].timing.code.coding.find(
      ({ code, system }) => system === timingAbbreviationCodeSystem && code != null && timingCodeFrequency[code.toLowerCase()] != null,
    );
    if (coding) {
      return timingCodeFrequency[coding.code.toLowerCase()];
    }
  } else if (isTimingTextMedication(resource)) {
    if (resource.dosageInstruction[0].timing.code.text.toLowerCase() === 'daily') {
      return 1;
    }
  }
  throw new TypeError(`Unsupported MedicationRequest Timing: ${JSON.stringify(resource.dosageInstruction[0].timing)}`);
}

/** Registers a Chart.js plugin that draws an ✕ at the end of every bar whose data point has `stopped: true` */
function registerStoppedMarkerPlugin() {
  Chart.register({
    id: 'medicationStoppedMarker',
    afterDatasetsDraw: (chart: Chart) => {
      const ctx = chart.ctx;
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        if (meta.type !== 'bar' || meta.hidden) {
          return;
        }
        meta.data.forEach((element, index) => {
          const point = dataset.data[index] as MedicationDataPoint | undefined;
          if (!point?.stopped) {
            return;
          }
          const { x, y, base, height } = (element as unknown as BarElement).getProps(['x', 'y', 'base', 'height'], true);
          if (x == null || y == null) {
            return;
          }
          const endX = Math.max(x, base);
          const size = Math.min(height / 2, 6);
          ctx.save();
          ctx.strokeStyle = typeof dataset.borderColor === 'string' ? dataset.borderColor : '#666666';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(endX - size, y - size);
          ctx.lineTo(endX + size, y + size);
          ctx.moveTo(endX - size, y + size);
          ctx.lineTo(endX + size, y - size);
          ctx.stroke();
          ctx.restore();
        });
      });
    },
  });
}
