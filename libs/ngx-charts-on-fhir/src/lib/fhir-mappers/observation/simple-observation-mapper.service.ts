import { Injectable, Inject } from '@angular/core';
import { ScaleOptions } from 'chart.js';
import { Observation } from 'fhir/r4';
import { merge } from 'lodash-es';
import { DataLayer } from '../../data-layer/data-layer';
import { Mapper } from '../multi-mapper.service';
import { ChartAnnotation, isDefined } from '../../utils';
import { TIME_SCALE_OPTIONS, LINEAR_SCALE_OPTIONS, ANNOTATION_OPTIONS } from '../fhir-mapper-options';
import { HOME_DATASET_LABEL_SUFFIX } from '../../fhir-chart-summary/home-measurement-summary.service';

/** Required properties for mapping an Observation with `SimpleObservationMapper` */
export type SimpleObservation = {
  code: {
    text: string;
  };
  effectiveDateTime: string;
  valueQuantity: {
    value: number;
    unit: string;
  };
} & Observation;
export function isSimpleObservation(resource: Observation): resource is SimpleObservation {
  return !!(
    resource.resourceType === 'Observation' &&
    resource.code?.text &&
    resource.effectiveDateTime &&
    resource.valueQuantity?.value &&
    resource.valueQuantity?.unit
  );
}

/** Maps a FHIR Observation resource that has a single valueQuantity */
@Injectable({
  providedIn: 'root',
})
export class SimpleObservationMapper implements Mapper<SimpleObservation> {
  constructor(
    @Inject(TIME_SCALE_OPTIONS) private timeScaleOptions: ScaleOptions<'time'>,
    @Inject(LINEAR_SCALE_OPTIONS) private linearScaleOptions: ScaleOptions<'linear'>,
    @Inject(ANNOTATION_OPTIONS) private annotationOptions: ChartAnnotation
  ) {}
  canMap = isSimpleObservation;
  map(resource: SimpleObservation): DataLayer {
    const scaleName = `${resource.code.text} (${resource.valueQuantity.unit})`;
    return {
      name: resource.code.text,
      category: resource.category?.flatMap((c) => c.coding?.map((coding) => coding.display)).filter(isDefined),
      datasets: [
        {
          label: resource.code.text + getMeasurementSettingSuffix(resource),
          yAxisID: scaleName,
          pointRadius: isHomeMeasurement(resource) ? 3 : 5,
          pointStyle: isHomeMeasurement(resource) ? 'rectRot' : 'circle',
          data: [
            {
              x: new Date(resource.effectiveDateTime).getTime(),
              y: resource.valueQuantity.value,
            },
          ],
        },
      ],
      scale: merge({}, this.linearScaleOptions, {
        id: scaleName,
        title: { text: scaleName },
      }),
      annotations: resource.referenceRange?.map<ChartAnnotation>((range) =>
        merge({}, this.annotationOptions, {
          id: `${resource.code.text} Reference Range`,
          label: { content: `${resource.code.text} Reference Range` },
          yScaleID: scaleName,
          yMax: range?.high?.value,
          yMin: range?.low?.value,
        })
      ),
    };
  }
}

export const measurementSettingExtUrl = 'http://hl7.org/fhir/us/vitals/StructureDefinition/MeasurementSettingExt';
export const homeEnvironmentCode = '264362003';
export function getMeasurementSettingSuffix(resource: Observation): string {
  return isHomeMeasurement(resource) ? HOME_DATASET_LABEL_SUFFIX : '';
}
export function isHomeMeasurement(resource: Observation): boolean {
  if (resource.extension) {
    const measurementSetting = resource.extension.find((ext) => ext.url === measurementSettingExtUrl);
    if (measurementSetting?.valueCodeableConcept?.coding?.[0].code === homeEnvironmentCode) {
      return true;
    }
  }
  return false;
}
