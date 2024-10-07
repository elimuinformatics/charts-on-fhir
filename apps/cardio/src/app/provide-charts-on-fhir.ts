import {
  BloodPressureMapper,
  ComponentObservationMapper,
  DurationMedicationMapper,
  MedicationSummaryService,
  ScatterDataPointSummaryService,
  SimpleMedicationMapper,
  SimpleObservationMapper,
  provideChartsOnFhir,
  withColors,
  withDataLayerServices,
  withMappers,
  withSummaryServices,
} from '@elimuinformatics/ngx-charts-on-fhir';
import { ObservationLayerService } from './datasets/observations.service';
import { MedicationLayerService } from './datasets/medications.service';

export default () =>
  provideChartsOnFhir(
    withColors('#e36667', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#c36d3c', '#f781bf', '#c46358', '#5a84a1', '#ba803f', '#90b354', '#ab7490'),
    withMappers(BloodPressureMapper, ComponentObservationMapper, SimpleObservationMapper, DurationMedicationMapper, SimpleMedicationMapper),
    withDataLayerServices(ObservationLayerService, MedicationLayerService),
    withSummaryServices(MedicationSummaryService, ScatterDataPointSummaryService)
  );
