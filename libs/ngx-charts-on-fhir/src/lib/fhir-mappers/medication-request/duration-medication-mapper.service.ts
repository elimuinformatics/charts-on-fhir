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

/**
 * Smallest length, in pixels, at which a duration bar is drawn, so an order stopped minutes after it was written is still visible.
 * The plugin draws it rather than Chart.js `minBarLength`, which clamps an out-of-view bar into the plot area.
 */
const MIN_BAR_LENGTH_PX = 4;

/**
 * Maps a FHIR MedicationRequest resource for which the supply duration can be calculated using one the supported algorthims.
 *
 * Each order is drawn as one bar covering the first fill and all authorized refills. Refills are authorized, not dispensed,
 * so the bar is an estimate of the period the patient is meant to be on the medication.
 *
 * A `stopped` order is truncated at its stop date (`dosageInstruction[0].timing.repeat.boundsPeriod.end`), and its
 * data point is flagged with `stopped: true` so the chart draws an end marker.
 */
@Injectable()
export class DurationMedicationMapper implements Mapper<DurationMedication> {
  constructor(private readonly baseMapper: SimpleMedicationMapper) {
    registerMedicationBarPlugin();
  }
  canMap = isDurationMedication;
  map(resource: DurationMedication): DataLayer<'bar', MedicationDataPoint[]> {
    const supply = computeSupply(resource);
    const authoredOn = new Date(resource.authoredOn).getTime();
    const firstFillEnd = authoredOn + supply.firstFill;
    const supplyEnd = firstFillEnd + supply.refills * supply.refill;
    const stop = computeStop(resource);
    const stoppedAt = stop?.time;
    // A bounds period already ends at the stop date, so a stopped bounds-period order is marked even though it is not shortened
    const truncated = stoppedAt != null && (stoppedAt < supplyEnd || supply.fromBoundsPeriod);
    const end = truncated ? Math.max(Math.min(stoppedAt, supplyEnd), authoredOn) : supplyEnd;
    const tooltip = buildTooltip(resource, authoredOn, supply, supplyEnd, stop);

    const layer = this.baseMapper.map(resource) as DataLayer<'bar', MedicationDataPoint[]>;
    layer.datasets = layer.datasets.map((dataset) => {
      const data: MedicationDataPoint[] = [
        {
          x: [authoredOn, end],
          y: dataset.data[0].y,
          authoredOn,
          tooltip,
          resource,
          ...(truncated && { stopped: true }),
        },
      ];
      return {
        ...dataset,
        label: dataset.label + ' (Est. Duration)',
        type: 'bar',
        borderWidth: 1,
        borderSkipped: false,
        barPercentage: 1,
        grouped: false,
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
    const firstFillDuration = (firstFill.value! / dailyQuantity) * MILLISECONDS_PER_DAY;
    // Refills are dispensed in the per-fill quantity. When it is missing or in another unit, the refill period is unknown,
    // so only the first fill is drawn rather than assuming each refill matches the first fill.
    const perFill = resource.dispenseRequest.quantity;
    if (perFill?.value == null || perFill.code !== doseQuantity.code) {
      return { firstFill: firstFillDuration, refill: 0, refills: 0 };
    }
    return {
      firstFill: firstFillDuration,
      refill: (perFill.value / dailyQuantity) * MILLISECONDS_PER_DAY,
      refills: resource.dispenseRequest.numberOfRepeatsAllowed ?? 0,
    };
  }
  throw new TypeError('Cannot compute duration for this MedicationRequest');
}

type Stop = {
  /** Stop time in milliseconds */
  time: number;
  /** False when the record gives only a date (or year-month, or year) for the stop */
  hasTime: boolean;
};

/** Stop time of a `stopped` order, or `undefined` if the order is not stopped or the stop time is not recorded */
function computeStop(resource: MedicationRequest): Stop | undefined {
  if (resource.status !== 'stopped') {
    return undefined;
  }
  const end = resource.dosageInstruction?.[0]?.timing?.repeat?.boundsPeriod?.end;
  return end ? parsePeriodEnd(end) : undefined;
}

/**
 * Parses the end of a FHIR Period.
 * A dateTime without a time (`2024-03-01`, `2024-03`, `2024`) means the whole day, month, or year, so it is read as the local
 * end of that period. `new Date('2024-03-01')` would read it as UTC midnight, which is the previous day west of UTC.
 */
function parsePeriodEnd(end: string): Stop {
  const match = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(end);
  if (!match) {
    return { time: new Date(end).getTime(), hasTime: true };
  }
  const year = Number(match[1]);
  const month = match[2] ? Number(match[2]) : 12;
  // day 0 of the following month is the last day of `month`
  const day = match[3] ? Number(match[3]) : new Date(year, month, 0).getDate();
  return { time: new Date(year, month - 1, day, 23, 59, 59, 999).getTime(), hasTime: false };
}

function buildTooltip(resource: MedicationRequest, authoredOn: number, supply: Supply, supplyEnd: number, stop: Stop | undefined): string[] {
  const days = Math.round(supply.firstFill / MILLISECONDS_PER_DAY);
  const refillWord = supply.refills === 1 ? 'refill' : 'refills';
  const refills = supply.refills > 0 ? ` + ${supply.refills} ${refillWord}` : '';
  const tooltip = [`Prescribed: ${formatDate(authoredOn)}`, `${days}-day supply${refills} (est. through ${formatDate(supplyEnd)})`];
  if (stop) {
    tooltip.push(`Stopped: ${stop.hasTime ? formatDateTime(stop.time) : formatDate(stop.time)}`);
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

/**
 * Registers a Chart.js plugin for medication duration bars. It draws bars shorter than `MIN_BAR_LENGTH_PX` at that length,
 * and an ✕ at the end of every bar whose data point has `stopped: true`. Drawing is clipped to the plot area, so a bar that is
 * panned or zoomed out of view leaves nothing over the axes.
 */
function registerMedicationBarPlugin() {
  Chart.register({
    id: 'medicationBars',
    afterDatasetsDraw: (chart: Chart) => {
      const ctx = chart.ctx;
      const { left, top, width, height: areaHeight } = chart.chartArea;
      ctx.save();
      ctx.beginPath();
      ctx.rect(left, top, width, areaHeight);
      ctx.clip();
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        if (meta.type !== 'bar' || meta.hidden) {
          return;
        }
        const color = typeof dataset.borderColor === 'string' ? dataset.borderColor : '#666666';
        meta.data.forEach((element, index) => {
          const point = dataset.data[index] as MedicationDataPoint | undefined;
          if (point?.authoredOn == null) {
            return;
          }
          const { x, y, base, height } = (element as unknown as BarElement).getProps(['x', 'y', 'base', 'height'], true);
          if (x == null || y == null) {
            return;
          }
          const start = Math.min(x, base);
          let end = Math.max(x, base);
          if (end - start < MIN_BAR_LENGTH_PX) {
            end = start + MIN_BAR_LENGTH_PX;
            ctx.fillStyle = color;
            ctx.fillRect(start, y - height / 2, MIN_BAR_LENGTH_PX, height);
          }
          if (point.stopped) {
            drawStoppedMarker(ctx, end, y, Math.min(height / 2, 6), color);
          }
        });
      });
      ctx.restore();
    },
  });
}

function drawStoppedMarker(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - size, y - size);
  ctx.lineTo(x + size, y + size);
  ctx.moveTo(x - size, y + size);
  ctx.lineTo(x + size, y - size);
  ctx.stroke();
  ctx.restore();
}
