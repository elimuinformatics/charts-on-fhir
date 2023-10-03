import { DataLayerService } from '@elimuinformatics/ngx-charts-on-fhir';
import { ObservationLayerService } from '../datasets/observations.service';

export const dataLayerProviders = [{ provide: DataLayerService, useExisting: ObservationLayerService, multi: true }];
