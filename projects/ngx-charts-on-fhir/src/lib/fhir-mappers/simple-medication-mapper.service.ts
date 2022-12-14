import { Injectable, Inject, forwardRef } from '@angular/core';
import { ScaleOptions } from 'chart.js';
import { MedicationOrder } from 'fhir/r2';
import { merge } from 'lodash-es';
import { DataLayer } from '../data-layer/data-layer';
import { Mapper } from '../fhir-converter/multi-mapper.service';
import { TIME_SCALE_OPTIONS, CATEGORY_SCALE_OPTIONS } from './fhir-mapper-options';
import { FhirMappersModule } from './fhir-mappers.module';

/** Required properties for mapping a MedicationOrder with [SimpleMedicationMapper] */
export type SimpleMedication = {
  medicationCodeableConcept: {
    text: string;
  };
  dateWritten: string;
} & MedicationOrder;
export function isMedication(resource: MedicationOrder): resource is SimpleMedication {
  return !!(resource.resourceType === 'MedicationOrder' && resource.dateWritten && resource.medicationCodeableConcept?.text);
}

/** Maps a FHIR MedicationOrder resource that only has a dateWritten and no supply duration */
@Injectable({
  providedIn: forwardRef(() => FhirMappersModule),
})
export class SimpleMedicationMapper implements Mapper<SimpleMedication> {
  constructor(
    @Inject(TIME_SCALE_OPTIONS) private timeScaleOptions: ScaleOptions<'time'>,
    @Inject(CATEGORY_SCALE_OPTIONS) private categoryScaleOptions: ScaleOptions<'category'>
  ) {}
  canMap = isMedication;
  map(resource: SimpleMedication): DataLayer {
    return {
      name: resource?.medicationCodeableConcept?.text,
      category: 'Medication',
      datasets: [
        {
          label: resource?.medicationCodeableConcept?.text,
          yAxisID: 'medications',
          indexAxis: 'y',
          data: [
            {
              x: new Date(resource.dateWritten).getTime(),
              y: resource?.medicationCodeableConcept?.text,
            },
          ],
        },
      ],
      scales: {
        timeline: this.timeScaleOptions,
        medications: merge({}, this.categoryScaleOptions, {
          title: { text: 'Medications' },
        }),
      },
    };
  }
}
