import { Injectable, Inject } from '@angular/core';
import { ScaleOptions } from 'chart.js';
import { MedicationRequest } from 'fhir/r4';
import { merge } from 'lodash-es';
import { DataLayer, TimelineChartType, TimelineDataPoint } from '../../data-layer/data-layer';
import { Mapper } from '../multi-mapper.service';
import { MEDICATION_SCALE_OPTIONS } from '../fhir-mapper-options';
import { formatDate } from '../../utils';
import { FhirCodeService } from '../fhir-code.service';

/** Required properties for mapping a MedicationRequest with `SimpleMedicationMapper` */
export type SimpleMedication = {
  medicationCodeableConcept: {
    text: string;
  };
  authoredOn: string;
} & MedicationRequest;
export function isMedication(resource: MedicationRequest): resource is SimpleMedication {
  return !!(resource.resourceType === 'MedicationRequest' && resource.authoredOn && resource.medicationCodeableConcept?.text);
}

export type MedicationDataPoint = TimelineDataPoint & {
  y: string;
  authoredOn: number;
};

/** Maps a FHIR MedicationRequest resource that only has an `authoredOn` and no supply duration */
@Injectable({
  providedIn: 'root',
})
export class SimpleMedicationMapper implements Mapper<SimpleMedication> {
  constructor(@Inject(MEDICATION_SCALE_OPTIONS) private medicationScaleOptions: ScaleOptions<'category'>, private codeService: FhirCodeService) {}
  canMap = isMedication;
  map(resource: SimpleMedication): DataLayer<TimelineChartType, MedicationDataPoint[]> {
    const authoredOn = new Date(resource.authoredOn).getTime();
    const codeName = this.codeService.getName(resource?.medicationCodeableConcept);
    return {
      name: 'Prescribed Medications',
      category: ['medication'],
      datasets: [
        {
          type: 'scatter',
          label: codeName,
          yAxisID: 'medications',
          indexAxis: 'y',
          pointRadius: 10,
          pointHoverRadius: 10,
          pointBorderWidth: 1,
          data: [
            {
              x: authoredOn,
              y: codeName,
              authoredOn: authoredOn,
              tooltip: `Prescribed: ${formatDate(authoredOn)}`,
            },
          ],
          chartsOnFhir: {
            backgroundStyle: 'transparent',
          },
        },
      ],
      scale: merge({}, this.medicationScaleOptions, {
        id: 'medications',
        title: { text: ['Prescribed', 'Medications'] },
      }),
      // use annotations for labels so they are drawn on top of the data (axis labels are drawn underneath)
      annotations: [
        {
          id: codeName,
          type: 'line',
          borderWidth: 0,
          label: {
            display: true,
            content: [codeName],
            position: 'start',
            color: 'black',
            backgroundColor: 'transparent',
            padding: 0,
            font: {
              size: 14,
              weight: 'normal',
            },
          },
          value: codeName,
          scaleID: 'medications',
        },
      ],
    };
  }
}
