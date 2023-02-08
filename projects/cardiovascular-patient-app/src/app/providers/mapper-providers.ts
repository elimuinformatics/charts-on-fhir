import { BloodPressureMapper, Mapper } from 'ngx-charts-on-fhir';

/**
 * Resource Mappers for FhirConverter, listed in priority order.
 * If more than one Mapper can handle a given resource, the first one will be used.
 */
export const mapperProviders = [{ provide: Mapper, useExisting: BloodPressureMapper, multi: true }];
