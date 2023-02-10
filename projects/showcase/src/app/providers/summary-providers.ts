import { MedicationSummaryService, ScatterDataPointSummaryService, SummaryService, HomeMeasurementSummaryService } from 'ngx-charts-on-fhir';

export const summaryProviders = [
  { provide: SummaryService, useExisting: MedicationSummaryService, multi: true },
  { provide: SummaryService, useExisting: HomeMeasurementSummaryService, multi: true },
  { provide: SummaryService, useExisting: ScatterDataPointSummaryService, multi: true },
];
