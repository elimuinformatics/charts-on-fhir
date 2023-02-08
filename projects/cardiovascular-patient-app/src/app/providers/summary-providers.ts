import { HomeMeasurementSummaryService, ScatterDataPointSummaryService, SummaryService } from 'ngx-charts-on-fhir';

export const summaryProviders = [
  { provide: SummaryService, useExisting: HomeMeasurementSummaryService, multi: true },
  { provide: SummaryService, useExisting: ScatterDataPointSummaryService, multi: true },
];
