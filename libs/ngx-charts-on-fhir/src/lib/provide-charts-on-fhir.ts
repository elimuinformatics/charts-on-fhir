import { Provider, Type } from '@angular/core';
import { COLOR_PALETTE, DataLayerColorService } from './data-layer/data-layer-color.service';
import { DataLayerManagerService, DataLayerService } from './data-layer/data-layer-manager.service';
import { DataLayerMergeService } from './data-layer/data-layer-merge.service';
import { FhirChartConfigurationService } from './fhir-chart/fhir-chart-configuration.service';
import { FhirConverter } from './fhir-mappers/fhir-converter.service';
import { Mapper, MultiMapper } from './fhir-mappers/multi-mapper.service';
import { SummaryService } from './fhir-chart-summary/summary.service';
import { ReferenceRangeService } from './fhir-mappers/observation/reference-range.service';

/**
 * Returns a Provider array with all of the configured services.
 *
 * Use the following functions to configure the library with the desired services and options:
 * * `withDataLayerServices`
 * * `withSummaryServices`
 * * `withMappers`
 * * `withColors`
 *
 * Usage:
 * ```
 * providers: [
 *   provideChartsOnFhir(
 *     withColors('#e36667', '#377eb8', '#4daf4a'),
 *     withDataLayerServices(MedicationLayerService, ObservationLayerService),
 *     withMappers(SimpleMedicationMapper, SimpleObservationMapper),
 *     withSummaryServices(MedicationSummaryService, ScatterDataPointSummaryService),
 *   ),
 * ];
 * ```
 */
export function provideChartsOnFhir(...features: Provider[]): Provider[] {
  return [
    DataLayerManagerService,
    DataLayerMergeService,
    DataLayerColorService,
    FhirChartConfigurationService,
    FhirConverter,
    MultiMapper,
    ReferenceRangeService,
    ...features,
  ];
}

/** Provides the given DataLayerServices to the Charts-on-FHIR library */
export function withDataLayerServices(...services: Type<DataLayerService>[]): Provider[] {
  return services.map((service) => ({ provide: DataLayerService, useClass: service, multi: true }));
}

/** Provides the given SummaryServices to the Charts-on-FHIR library */
export function withSummaryServices(...services: Type<SummaryService>[]): Provider[] {
  return services.map((service) => ({ provide: SummaryService, useClass: service, multi: true }));
}

/** Provides the given Mappers to the Charts-on-FHIR library */
export function withMappers(...mappers: Type<Mapper<any, any, any>>[]): Provider[] {
  return mappers.flatMap((mapper) => [mapper, { provide: Mapper, useClass: mapper, multi: true }]);
}

/** Configures the color palette for the Charts-on-FHIR library */
export function withColors(...palette: string[]): Provider[] {
  return [{ provide: COLOR_PALETTE, useValue: palette }];
}
