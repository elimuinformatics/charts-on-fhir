import { ScatterDataPointSummaryService, SummaryService } from '@elimuinformatics/ngx-charts-on-fhir';

export const summaryProviders = [{ provide: SummaryService, useExisting: ScatterDataPointSummaryService, multi: true }];
