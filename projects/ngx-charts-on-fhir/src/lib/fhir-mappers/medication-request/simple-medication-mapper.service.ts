import { Injectable, Inject } from '@angular/core';
import { ScaleOptions } from 'chart.js';
import { MedicationRequest } from 'fhir/r4';
import { merge } from 'lodash-es';
import { DataLayer, TimelineChartType } from '../../data-layer/data-layer';
import { Mapper } from '../multi-mapper.service';
import { TIME_SCALE_OPTIONS, MEDICATION_SCALE_OPTIONS } from '../fhir-mapper-options';

/** Required properties for mapping a MedicationRequest with [SimpleMedicationMapper] */
export type SimpleMedication = {
  medicationCodeableConcept: {
    text: string;
  };
  authoredOn: string;
} & MedicationRequest;
export function isMedication(resource: MedicationRequest): resource is SimpleMedication {
  return !!(resource.resourceType === 'MedicationRequest' && resource.authoredOn && resource.medicationCodeableConcept?.text);
}

export type MedicationDataPoint = {
  x: number;
  y: string;
  authoredOn: number;
};

/** Maps a FHIR MedicationRequest resource that only has an `authoredOn` and no supply duration */
@Injectable({
  providedIn: 'root',
})
export class SimpleMedicationMapper implements Mapper<SimpleMedication> {
  constructor(
    @Inject(TIME_SCALE_OPTIONS) private timeScaleOptions: ScaleOptions<'time'>,
    @Inject(MEDICATION_SCALE_OPTIONS) private medicationScaleOptions: ScaleOptions<'medication'>
  ) {}
  canMap = isMedication;
  map(resource: SimpleMedication): DataLayer<TimelineChartType, MedicationDataPoint[]> {
    return {
      name: 'Medications',
      category: ['medication'],
      datasets: [
        {
          type: 'scatter',
          label: resource?.medicationCodeableConcept?.text,
          yAxisID: 'medications',
          indexAxis: 'y',
          data: [
            {
              x: new Date(resource.authoredOn).getTime(),
              y: resource?.medicationCodeableConcept?.text,
              authoredOn: new Date(resource.authoredOn).getTime(),
            },
          ],
        },
      ],
      scale: merge({}, this.medicationScaleOptions, {
        id: 'medications',
        title: { text: 'Medications' },
      }),
    };
  }
}
