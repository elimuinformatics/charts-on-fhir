import { DataLayerService } from '@elimuinformatics/ngx-charts-on-fhir';
import { MedicationLayerService } from '../datasets/medications.service';
import { ObservationLayerService } from '../datasets/observations.service';
import { EncounterLayerService } from '../datasets/encounters.service';

export const dataLayerProviders = [
  { provide: DataLayerService, useExisting: EncounterLayerService, multi: true },
  { provide: DataLayerService, useExisting: ObservationLayerService, multi: true },
  { provide: DataLayerService, useExisting: MedicationLayerService, multi: true },
];
