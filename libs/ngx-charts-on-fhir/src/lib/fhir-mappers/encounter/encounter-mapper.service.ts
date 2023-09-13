import { Injectable, Inject } from '@angular/core';
import { ScaleOptions } from 'chart.js';
import { Encounter, Period } from 'fhir/r4';
import { merge } from 'lodash-es';
import { DataLayer } from '../../data-layer/data-layer';
import { Mapper } from '../multi-mapper.service';
import { CATEGORY_SCALE_OPTIONS } from '../fhir-mapper-options';
import { formatDateTime } from '../../utils';

/** Required properties for mapping an Encounter with `EncounterMapper` */
export type MappableEncounter = {
  period: {
    start: string;
  } & Period;
} & Encounter;
export function isMappableEncounter(resource: Encounter): resource is MappableEncounter {
  return !!(resource.resourceType === 'Encounter' && resource.period?.start);
}

/** Maps a FHIR Encounter resource */
@Injectable({
  providedIn: 'root',
})
export class EncounterMapper implements Mapper<MappableEncounter> {
  constructor(@Inject(CATEGORY_SCALE_OPTIONS) private categoryScaleOptions: ScaleOptions<'category'>) {}
  canMap = isMappableEncounter;
  map(resource: MappableEncounter): DataLayer {
    return {
      name: 'Encounters',
      category: ['encounter'],
      datasets: [
        {
          type: 'scatter',
          label: 'Encounter',
          yAxisID: 'encounters',
          indexAxis: 'y',
          data: [
            {
              x: new Date(resource.period.start).getTime(),
              y: 'Encounters',
              tooltip: [
                `Type: ${resource.type?.[0]?.text ?? '(unknown)'}`,
                `Start: ${formatDateTime(resource.period.start)}`,
                `End: ${resource.period.end ? formatDateTime(resource.period.end) : '(unknown)'}`,
              ],
              resource,
            },
          ],
        },
      ],
      scale: merge({}, this.categoryScaleOptions, {
        id: 'encounters',
        offset: true,
        stackWeight: 0.4,
        title: { text: ['Encounters'] },
        labels: ['Encounters'],
      }),
    };
  }
}
