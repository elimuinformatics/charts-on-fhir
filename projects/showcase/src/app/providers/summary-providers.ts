import { MedicationSummaryService, ScatterDataPointSummaryService, SummaryService } from 'ngx-charts-on-fhir';

export const summaryProviders = [
  { provide: SummaryService, useExisting: ScatterDataPointSummaryService, multi: true },
  { provide: SummaryService, useExisting: MedicationSummaryService, multi: true },
];
