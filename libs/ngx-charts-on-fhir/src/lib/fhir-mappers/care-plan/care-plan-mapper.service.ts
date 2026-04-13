import { Injectable, Inject } from '@angular/core';
import { ScaleOptions } from 'chart.js';
import { CarePlan } from 'fhir/r4';
import { merge } from 'lodash-es';
import { DataLayer, TimelineDataPoint } from '../../data-layer/data-layer';
import { Mapper } from '../multi-mapper.service';
import { CATEGORY_SCALE_OPTIONS } from '../fhir-mapper-options';
import { formatDate } from '../../utils';

/** CarePlan statuses that should be displayed on the Timeline Graph */
export const CARE_PLAN_DISPLAYED_STATUSES = ['active', 'ended', 'completed'] as const;
export type CarePlanDisplayedStatus = (typeof CARE_PLAN_DISPLAYED_STATUSES)[number];

/** Required properties for mapping a CarePlan with `CarePlanMapper` */
export type MappableCarePlan = {
  period: {
    start: string;
  };
  status: CarePlanDisplayedStatus;
} & CarePlan;

export function isMappableCarePlan(resource: CarePlan): resource is MappableCarePlan {
  return !!(
    resource.resourceType === 'CarePlan' &&
    resource.period?.start?.trim().length &&
    (CARE_PLAN_DISPLAYED_STATUSES as ReadonlyArray<string>).includes(resource.status)
  );
}

export type CarePlanDataPoint = TimelineDataPoint & {
  y: string;
};

/** Maps a FHIR CarePlan resource to a timeline bar showing its period */
@Injectable()
export class CarePlanMapper implements Mapper<MappableCarePlan> {
  constructor(@Inject(CATEGORY_SCALE_OPTIONS) private readonly categoryScaleOptions: ScaleOptions<'category'>) {}
  canMap = isMappableCarePlan;
  map(resource: MappableCarePlan): DataLayer<'bar', CarePlanDataPoint[]> {
    const title = resource.title ?? 'Care Plan';
    const start = new Date(resource.period.start).getTime();
    const end = resource.period.end?.trim().length ? new Date(resource.period.end).getTime() : new Date().getTime();

    const tooltip = [
      `Title: ${title}`,
      `Status: ${resource.status}`,
      `Start: ${formatDate(start)}`,
      `End: ${resource.period.end ? formatDate(end) : '(ongoing)'}`,
    ];

    return {
      name: 'Care Plans',
      category: ['care-plan'],
      datasets: [
        {
          type: 'bar',
          label: title,
          yAxisID: 'care-plans',
          indexAxis: 'y',
          borderWidth: 1,
          borderSkipped: false,
          barPercentage: 1,
          grouped: false,
          data: [
            {
              x: [start, end],
              y: title,
              tooltip,
              resource,
            },
          ],
        },
      ],
      scale: merge({}, this.categoryScaleOptions, {
        id: 'care-plans',
        title: { text: ['Care Plans'] },
      }),
    };
  }
}
