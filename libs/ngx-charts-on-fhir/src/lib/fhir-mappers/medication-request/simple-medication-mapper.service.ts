import { Injectable, Inject } from '@angular/core';
import { ScaleOptions, Chart } from 'chart.js';
import { MedicationRequest } from 'fhir/r4';
import { merge } from 'lodash-es';
import { DataLayer, TimelineChartType, TimelineDataPoint } from '../../data-layer/data-layer';
import { Mapper } from '../multi-mapper.service';
import { CATEGORY_SCALE_OPTIONS } from '../fhir-mapper-options';
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
  constructor(@Inject(CATEGORY_SCALE_OPTIONS) private categoryScaleOptions: ScaleOptions<'category'>, private codeService: FhirCodeService) {}
  canMap = isMedication;
  map(resource: SimpleMedication): DataLayer<TimelineChartType, MedicationDataPoint[]> {
    this.registerCustomPlugin();
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
              resource,
            },
          ],
          chartsOnFhir: {
            backgroundStyle: 'transparent',
            group: codeName,
          },
        },
      ],
      scale: merge({}, this.categoryScaleOptions, {
        id: 'medications',
        title: { text: ['Prescribed', 'Medications'] },
      }),
    };
  }

  // Register the custom plugin when the service is created
  registerCustomPlugin() {
    Chart.register({
      id: 'customLabels',
      afterDatasetsDraw: (chart) => {
        const ctx = chart.ctx;
        chart.data.datasets.forEach((dataset, datasetIndex) => {
          const meta = chart.getDatasetMeta(datasetIndex);
          if (meta.yAxisID === 'medications') {
            const label = dataset.label;
            const centerY = (meta.data[0].y + meta.data[meta.data.length - 1].y) / 2;
            ctx.fillStyle = 'black';
            ctx.font = '14px Arial';
            ctx.textAlign = 'start';
            ctx.fillText(label!, chart.chartArea.left, centerY);
          }
        });
      },
    });
  }
}
