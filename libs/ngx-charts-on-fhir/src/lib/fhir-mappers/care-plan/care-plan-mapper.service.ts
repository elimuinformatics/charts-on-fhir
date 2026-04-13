import { Injectable, Inject } from '@angular/core';
import { ScaleOptions } from 'chart.js';
import { CarePlan } from 'fhir/r4';
import { merge } from 'lodash-es';
import { DataLayer, TimelineDataPoint } from '../../data-layer/data-layer';
import { Mapper } from '../multi-mapper.service';
import { CATEGORY_SCALE_OPTIONS } from '../fhir-mapper-options';
import { formatDate } from '../../utils';

const ALLOWED_STATUSES = ['active', 'ended', 'completed'] as const;

/** Required properties for mapping a CarePlan with `CarePlanMapper` */
export type MappableCarePlan = {
  period: {
    start: string;
  };
} & CarePlan;

export function isMappableCarePlan(resource: CarePlan): resource is MappableCarePlan {
  return !!(
    resource.resourceType === 'CarePlan' &&
    resource.period?.start &&
    (ALLOWED_STATUSES as readonly string[]).includes(resource.status)
  );
}

export type CarePlanDataPoint = TimelineDataPoint & {
  y: string;
};

/** Maps a FHIR CarePlan resource to a Timeline bar dataset */
@Injectable()
export class CarePlanMapper implements Mapper<MappableCarePlan> {
  constructor(@Inject(CATEGORY_SCALE_OPTIONS) private readonly categoryScaleOptions: ScaleOptions<'category'>) {}
  canMap = isMappableCarePlan;
  map(resource: MappableCarePlan): DataLayer<'bar', CarePlanDataPoint[]> {
    const label = resource.title ?? 'Care Plan';
    const start = new Date(resource.period.start).getTime();
    const end = resource.period?.end ? new Date(resource.period.end).getTime() : Date.now();
    const tooltip = [
      `Title: ${label}`,
      `Status: ${resource.status}`,
      `Start: ${formatDate(start)}`,
      ...(resource.period?.end ? [`End: ${formatDate(end)}`] : []),
    ];
    return {
      name: 'Care Plans',
      category: ['care-plan'],
      datasets: [
        {
          type: 'bar',
          label,
          yAxisID: 'care-plans',
          indexAxis: 'y',
          borderWidth: 1,
          borderSkipped: false,
          barPercentage: 1,
          grouped: false,
          data: [
            {
              x: [start, end],
              y: label,
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
      annotations: [
        {
          id: label,
          type: 'line',
          borderWidth: 0,
          label: {
            display: true,
            content: [label],
            position: 'start',
            color: '#666666',
            backgroundColor: 'transparent',
            padding: 0,
            font: {
              size: 14,
              weight: 'normal',
            },
          },
          value: label,
          scaleID: 'care-plans',
          drawTime: 'beforeDatasetsDraw',
        },
      ],
    };
  }
}
