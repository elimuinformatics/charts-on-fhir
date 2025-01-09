import { Injectable, Inject } from '@angular/core';
import { ScaleOptions } from 'chart.js';
import { Observation } from 'fhir/r4';
import { merge } from 'lodash-es';
import { DataLayer } from '../../data-layer/data-layer';
import { Mapper } from '../multi-mapper.service';
import { isDefined } from '../../utils';
import { LINEAR_SCALE_OPTIONS } from '../fhir-mapper-options';
import { FhirCodeService } from '../fhir-code.service';
import { ReferenceRangeService } from './reference-range.service';

export const HOME_DATASET_LABEL_SUFFIX = ' (Home)';

/** Required properties for mapping an Observation with `SimpleObservationMapper` */
export type SimpleObservation = {
  code: {
    text: string;
  };
  effectiveDateTime: string;
  valueQuantity: {
    value: number;
    unit?: string;
    code?: string;
  };
} & Observation;
export function isSimpleObservation(resource: Observation): resource is SimpleObservation {
  return !!(
    resource.resourceType === 'Observation' &&
    resource.code?.text &&
    resource.effectiveDateTime &&
    resource.valueQuantity?.value &&
    (!resource.valueQuantity.unit || !!resource.valueQuantity.unit) &&
    (!resource.valueQuantity.code || !!resource.valueQuantity.code)
  );
}

/** Maps a FHIR Observation resource that has a single valueQuantity */
@Injectable()
export class SimpleObservationMapper implements Mapper<SimpleObservation> {
  constructor(
    @Inject(LINEAR_SCALE_OPTIONS) private readonly linearScaleOptions: ScaleOptions<'linear'>,
    private readonly codeService: FhirCodeService,
    private readonly referenceRangeService: ReferenceRangeService,
  ) {}
  canMap = isSimpleObservation;
  map(resource: SimpleObservation, overrideLayerName?: string): DataLayer {
    const codeName = this.codeService.getName(resource.code, resource);
    const layerName = overrideLayerName ?? codeName;
    return {
      name: layerName,
      category: resource.category?.flatMap((c) => c.coding?.map((coding) => coding.code)).filter(isDefined),
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
            referenceRangeAnnotation: this.referenceRangeService.getAnnotationLabel(resource.referenceRange?.[0], layerName),
          },
        },
      ],
      scale: merge({}, this.linearScaleOptions, {
        id: layerName,
        title: { text: [layerName, resource.valueQuantity?.code].filter(isDefined) },
      }),
      annotations: resource.referenceRange
        ?.map((range) => this.referenceRangeService.createReferenceRangeAnnotation(range, layerName, layerName))
        .filter(isDefined),
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
