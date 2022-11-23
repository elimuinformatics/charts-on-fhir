import { ANALYSIS_CARDS, StatisticsComponent, ReferenceRangeComponent } from 'ngx-charts-on-fhir';
import { CustomCardExampleComponent } from '../cards/custom-card-example/custom-card-example.component';

export const analysisCardProviders = [
  { provide: ANALYSIS_CARDS, useValue: StatisticsComponent, multi: true },
  { provide: ANALYSIS_CARDS, useValue: ReferenceRangeComponent, multi: true },
  { provide: ANALYSIS_CARDS, useValue: CustomCardExampleComponent, multi: true },
];
