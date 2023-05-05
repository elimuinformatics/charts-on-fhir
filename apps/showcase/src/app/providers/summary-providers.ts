import { MedicationSummaryService, ScatterDataPointSummaryService, SummaryService } from '@elimuinformatics/ngx-charts-on-fhir';

export const summaryProviders = [
  { provide: SummaryService, useExisting: MedicationSummaryService, multi: true },
  { provide: SummaryService, useExisting: ScatterDataPointSummaryService, multi: true },
];
