import { ComponentObservationMapper, Mapper, SimpleObservationMapper, SimpleMedicationMapper, DurationMedicationMapper } from 'ngx-charts-on-fhir';
import { BloodPressureMapper } from '../datasets/blood-pressure-mapper';

/**
 * Resource Mappers for FhirConverter, listed in priority order.
 * If more than one Mapper can handle a given resource, the first one will be used.
 */
export const mapperProviders = [
  { provide: Mapper, useExisting: BloodPressureMapper, multi: true },
  { provide: Mapper, useExisting: ComponentObservationMapper, multi: true },
  { provide: Mapper, useExisting: SimpleObservationMapper, multi: true },
  { provide: Mapper, useExisting: DurationMedicationMapper, multi: true },
  { provide: Mapper, useExisting: SimpleMedicationMapper, multi: true },
];
