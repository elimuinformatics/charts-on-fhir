import { Injectable, Inject, forwardRef } from '@angular/core';
import { ScaleOptions } from 'chart.js';
import { MedicationOrder } from 'fhir/r2';
import { merge } from 'lodash-es';
import { DataLayer } from '../data-layer/data-layer';
import { Mapper } from '../fhir-converter/multi-mapper.service';
import { ChartAnnotation } from '../utils';
import { TIME_SCALE_OPTIONS, LINEAR_SCALE_OPTIONS, ANNOTATION_OPTIONS } from './fhir-mapper-options';
import { FhirMappersModule } from './fhir-mappers.module';

/** Required properties for mapping an Observation with [SimpleMedicationMapper] */
export type SimpleMedication = {
  medicationCodeableConcept: {
    text: string;
  };
  dateWritten: string;
} & MedicationOrder;
export function isMedication(resource: MedicationOrder): resource is SimpleMedication {
  return !!(
    resource.resourceType === 'MedicationOrder' &&
    resource.prescriber?.reference &&
    resource.dosageInstruction &&
    resource.medicationCodeableConcept
  );
}

/** Maps a FHIR Observation resource that has a single valueQuantity */
@Injectable({
  providedIn: forwardRef(() => FhirMappersModule),
})
export class SimpleMedicationMapper implements Mapper<SimpleMedication> {
  constructor(
    @Inject(TIME_SCALE_OPTIONS) private timeScaleOptions: ScaleOptions<'time'>,
    @Inject(LINEAR_SCALE_OPTIONS) private linearScaleOptions: ScaleOptions<'linear'>,
    @Inject(ANNOTATION_OPTIONS) private annotationOptions: ChartAnnotation
  ) {}
  canMap = isMedication;
//   created Medication Data Layer 
  map(resource: MedicationOrder): any {
    let endDate = new Date(resource.dateWritten ? resource.dateWritten : "" )
    endDate.setDate(endDate.getDate() + 2) 
    const output =  {
      name: resource?.medicationCodeableConcept?.text,
      category: 'Medication',
      datasets: [
        {
          label: resource?.medicationCodeableConcept?.text,
        //   yAxisID: resource.valueQuantity.unit,
          data: [
            [
              new Date(resource.dateWritten ? resource.dateWritten : "" ),
              endDate
            ],
          ],
        },
      ],
    //   scales: {
    //     timeline: this.timeScaleOptions,
    //     [resource.valueQuantity.unit]: merge({}, this.linearScaleOptions, {
    //       title: { text: resource.valueQuantity.unit },
    //     }),
    //   },
    //   annotations: resource.referenceRange?.map<ChartAnnotation>((range) =>
    //     merge({}, this.annotationOptions, {
    //       display: true,
    //       label: { content: `${resource.code.text} Reference Range` },
    //       yScaleID: resource.valueQuantity.unit,
    //       yMax: range?.high?.value,
    //       yMin: range?.low?.value,
    //     })
    //   ),
    };
    return output;
  }
}
