import { Injectable, Inject, forwardRef } from '@angular/core';
import { ScaleOptions } from 'chart.js';
import { MedicationRequest } from 'fhir/r4';
import { merge } from 'lodash-es';
import { DataLayer } from '../../data-layer/data-layer';
import { Mapper } from '../../fhir-converter/multi-mapper.service';
import { TIME_SCALE_OPTIONS, MEDICATION_SCALE_OPTIONS } from '../fhir-mapper-options';
import { FhirMappersModule } from '../fhir-mappers.module';

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

/** Maps a FHIR MedicationRequest resource that only has an `authoredOn` and no supply duration */
@Injectable({
  providedIn: forwardRef(() => FhirMappersModule),
})
export class SimpleMedicationMapper implements Mapper<SimpleMedication> {
  constructor(
    @Inject(TIME_SCALE_OPTIONS) private timeScaleOptions: ScaleOptions<'time'>,
    @Inject(MEDICATION_SCALE_OPTIONS) private medicationScaleOptions: ScaleOptions<'medication'>
  ) {}
  canMap = isMedication;
  map(resource: SimpleMedication): DataLayer {
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
