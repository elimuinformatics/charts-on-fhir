import { Injectable, Inject } from '@angular/core';
import { ScaleOptions, ScriptableContext } from 'chart.js';
import { Coding, Encounter, Period } from 'fhir/r4';
import { merge } from 'lodash-es';
import { DataLayer, TimelineChartType, TimelineDataPoint } from '../../data-layer/data-layer';
import { Mapper } from '../multi-mapper.service';
import { CATEGORY_SCALE_OPTIONS } from '../fhir-mapper-options';
import { formatDateTime } from '../../utils';

/** Required properties for mapping an Encounter with `EncounterMapper` */
export type MappableEncounter = {
  period: {
    start: string;
  } & Period;
  class: {
    code: string;
  } & Coding;
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
    const className = ENCOUNTER_CLASS_NAMES[resource.class.code] ?? 'Other';
    return {
      name: 'Encounters',
      category: ['encounter'],
      datasets: [
        {
          type: 'scatter',
          label: className,
          yAxisID: 'encounters',
          indexAxis: 'y',
          pointStyle: getPointStyle,
          pointHitRadius: ENCOUNTER_ICONS[resource.class.code] ? 6 : undefined,
          data: [
            {
              x: new Date(resource.period.start).getTime(),
              y: className,
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
        title: { text: ['Encounters'] },
      }),
      // use annotations for labels so they are drawn on top of the data (axis labels are drawn underneath)
      annotations: [
        {
          id: className,
          type: 'line',
          borderWidth: 0,
          label: {
            display: true,
            content: [className],
            position: 'start',
            color: '#666666',
            backgroundColor: 'transparent',
            padding: 0,
            font: {
              size: 14,
              weight: 'normal',
            },
          },
          value: className,
          scaleID: 'encounters',
        },
      ],
    };
  }
}

const ENCOUNTER_CLASS_NAMES: Record<string, string> = {
  AMB: 'Ambulatory',
  EMER: 'Emergency',
  IMP: 'Inpatient',
  ACUTE: 'Inpatient',
  NONAC: 'Inpatient',
  SS: 'Inpatient',
} as const;

const iconStethescope =
  '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.8,10c-0.4-1.2-1.6-2-2.8-2c-1.7,0-3,1.3-3,3c0,1.3,0.8,2.4,2,2.8v1.7c0,2.5-2,4.5-4.5,4.5S9,18,9,15.5v-1l3.1-2.5C13.3,11,14,9.6,14,8.1V3c0-0.6-0.4-1-1-1h-2c-0.6,0-1,0.4-1,1s0.4,1,1,1h1v4.1c0,0.9-0.4,1.8-1.1,2.3L8,12.7l-2.9-2.3C4.4,9.9,4,9,4,8.1V4h1c0.6,0,1-0.4,1-1S5.6,2,5,2H3C2.4,2,2,2.4,2,3v5.1c0,1.5,0.7,3,1.9,3.9L7,14.5v1c0,3.6,2.9,6.5,6.5,6.5s6.5-2.9,6.5-6.5v-1.7C21.6,13.3,22.4,11.6,21.8,10z"></path></svg>';
const iconAmbulance =
  '<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><path d="M 2.77 9 C 1.243 9 0 10.233 0 11.75 L 0 36.25 C 0 37.767 1.243 39 2.77 39 L 5 39 C 5 42.309 7.691 45 11 45 C 14.309 45 17 42.309 17 39 L 31 39 C 31 42.309 33.691 45 37 45 C 40.309 45 43 42.309 43 39 L 47.23 39 C 48.757 39 50.002 37.767 50.002 36.25 L 50.002 29.25 C 50.002 27.324 48.615 25.349 48.486 25.172 L 39.457 11.207 C 39.435 11.172 39.409 11.137 39.383 11.105 L 39.203 10.891 C 38.43 9.961 37.631 9 35.961 9 L 2.77 9 Z M 32 14 L 38.854 14 L 45.992 25 L 32 25 L 32 14 Z M 12.493 15.493 L 16.204 15.534 L 16.204 19.534 L 20.204 19.534 L 20.204 23.163 L 16.204 23.163 L 16.204 27.163 L 12.493 27.163 L 12.493 23.163 L 8.493 23.163 L 8.497 19.538 L 12.493 19.534 L 12.493 15.493 Z M 11 35 C 13.206 35 15 36.794 15 39 C 15 41.206 13.206 43 11 43 C 8.794 43 7 41.206 7 39 C 7 36.794 8.794 35 11 35 Z M 37 35 C 39.206 35 41 36.794 41 39 C 41 41.206 39.206 43 37 43 C 34.794 43 33 41.206 33 39 C 33 36.794 34.794 35 37 35 Z"></path></svg>';
const iconHospital =
  '<svg viewBox="-32 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M448 492v20H0v-20c0-6.627 5.373-12 12-12h20V120c0-13.255 10.745-24 24-24h88V24c0-13.255 10.745-24 24-24h112c13.255 0 24 10.745 24 24v72h88c13.255 0 24 10.745 24 24v360h20c6.627 0 12 5.373 12 12zM308 192h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12zm-168 64h40c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12zm104 128h-40c-6.627 0-12 5.373-12 12v84h64v-84c0-6.627-5.373-12-12-12zm64-96h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12zm-116 12c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12v-40zM182 96h26v26a6 6 0 0 0 6 6h20a6 6 0 0 0 6-6V96h26a6 6 0 0 0 6-6V70a6 6 0 0 0-6-6h-26V38a6 6 0 0 0-6-6h-20a6 6 0 0 0-6 6v26h-26a6 6 0 0 0-6 6v20a6 6 0 0 0 6 6z"></path></svg>';

const ENCOUNTER_ICONS: Record<string, string> = {
  AMB: iconStethescope,
  EMER: iconAmbulance,
  IMP: iconHospital,
  ACUTE: iconHospital,
  NONAC: iconHospital,
  SS: iconHospital,
} as const;

function createSvgImage(svg: string) {
  const dataUrlPrefix = 'data:image/svg+xml;charset=utf-8,';
  const image = new Image();
  image.src = dataUrlPrefix + encodeURIComponent(svg);
  image.width = 24;
  image.height = 24;
  return image;
}

const imageCache: Record<string, Record<string, HTMLImageElement>> = {};

const getPointStyle = (context: ScriptableContext<TimelineChartType>) => {
  const point = context?.dataset?.data?.[context.dataIndex] as TimelineDataPoint;
  const resource: MappableEncounter = point.resource;
  const code = resource.class.code;
  const svg = ENCOUNTER_ICONS[code];
  if (!svg) {
    return undefined;
  }
  if (!imageCache[code]) {
    imageCache[code] = {};
  }
  let color = context?.dataset?.pointBackgroundColor;
  if (!color || typeof color !== 'string') {
    color = 'black';
  }
  if (!imageCache[code][color]) {
    imageCache[code][color] = createSvgImage(svg.replace('<path ', `<path style="fill:${color}" `));
  }
  return imageCache[code][color];
};
