import { DataLayerService } from 'ngx-charts-on-fhir';
import { ExampleDataset } from '../datasets/example.service';
import { MedicationLayerService } from '../datasets/medications.service';
import { ObservationLayerService } from '../datasets/observations.service';

export const dataLayerProviders = [
  { provide: DataLayerService, useExisting: ExampleDataset, multi: true },
  { provide: DataLayerService, useExisting: ObservationLayerService, multi: true },
  { provide: DataLayerService, useExisting: MedicationLayerService, multi: true },
];
