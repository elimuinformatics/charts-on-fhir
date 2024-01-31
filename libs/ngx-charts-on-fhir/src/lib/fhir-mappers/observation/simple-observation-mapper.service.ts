import { Injectable, Inject } from '@angular/core';
import { ScaleOptions } from 'chart.js';
import { Observation } from 'fhir/r4';
import { merge } from 'lodash-es';
import { DataLayer } from '../../data-layer/data-layer';
import { Mapper } from '../multi-mapper.service';
import { ChartAnnotation, isDefined } from '../../utils';
import { LINEAR_SCALE_OPTIONS, ANNOTATION_OPTIONS } from '../fhir-mapper-options';
import { FhirCodeService } from '../fhir-code.service';

export const HOME_DATASET_LABEL_SUFFIX = ' (Home)';
export const CLINIC_DATASET_LABEL_SUFFIX = ' (Clinic)';

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
    @Inject(LINEAR_SCALE_OPTIONS) private linearScaleOptions: ScaleOptions<'linear'>,
    @Inject(ANNOTATION_OPTIONS) private annotationOptions: ChartAnnotation,
    private codeService: FhirCodeService
  ) {}
  canMap = isSimpleObservation;
  map(resource: SimpleObservation, layerName?: string): DataLayer {
    const codeName = this.codeService.getName(resource.code);
    layerName = layerName ?? codeName;
    return {
      name: layerName,
      category: resource.category?.flatMap((c) => c.coding?.map((coding) => coding.display)).filter(isDefined),
      datasets: [
        {
          label: codeName + getMeasurementSettingSuffix(resource),
          yAxisID: layerName,
          data: [
            {
              x: new Date(resource.effectiveDateTime).getTime(),
              y: resource.valueQuantity.value,
              resource,
            },
          ],
          chartsOnFhir: {
            group: layerName,
            colorPalette: isHomeMeasurement(resource) ? 'light' : 'dark',
            tags: [isHomeMeasurement(resource) ? 'Home' : 'Clinic'],
            referenceRangeAnnotation: `${layerName} Reference Range`,
          },
        },
      ],
      scale: merge({}, this.linearScaleOptions, {
        id: layerName,
        title: { text: [layerName, resource.valueQuantity.unit] },
      }),
      annotations: resource.referenceRange?.map<ChartAnnotation>((range) =>
        merge({}, this.annotationOptions, {
          id: `${layerName} Reference Range`,
          label: { content: `${layerName} Reference Range` },
          yScaleID: layerName,
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
  return isHomeMeasurement(resource) ? HOME_DATASET_LABEL_SUFFIX : CLINIC_DATASET_LABEL_SUFFIX;
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
