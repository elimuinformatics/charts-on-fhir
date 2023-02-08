import { MedicationSummaryService, ScatterDataPointSummaryService, SummaryService } from 'ngx-charts-on-fhir';
import { HomeMeasurementSummaryService } from 'projects/ngx-charts-on-fhir/src/lib/fhir-chart-summary/home-measurement-summary.service';

export const summaryProviders = [
  { provide: SummaryService, useExisting: MedicationSummaryService, multi: true },
  { provide: SummaryService, useExisting: HomeMeasurementSummaryService, multi: true },
  { provide: SummaryService, useExisting: ScatterDataPointSummaryService, multi: true },
];
