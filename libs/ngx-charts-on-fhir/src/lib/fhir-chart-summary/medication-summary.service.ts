import { Injectable } from '@angular/core';
import { formatDate } from '../utils';
import { MedicationDataPoint } from '../fhir-mappers/medication-request/simple-medication-mapper.service';
import { DataLayer, TimelineChartType } from '../data-layer/data-layer';
import { SummaryService } from './summary.service';
import { groupBy } from 'lodash-es';

@Injectable()
export class MedicationSummaryService implements SummaryService {
  canSummarize(layer: DataLayer): boolean {
    return layer.category?.includes('medication') ?? false;
  }
  summarize(layer: DataLayer<TimelineChartType, MedicationDataPoint[]>): Record<string, string>[] {
    const groups = groupBy(layer.datasets, (dataset) => dataset.chartsOnFhir?.group ?? dataset.label);
    const datasets = Object.entries(groups).map(([label, ds]) => ({ ...ds[0], label, data: ds.flatMap((d) => d.data) }));
    return datasets.map((dataset) => ({
      [layer.name]: dataset.label ?? '(unknown)',
      'First Written': formatDate(Math.min(...dataset.data.map((point) => point.authoredOn))),
      'Last Written': formatDate(Math.max(...dataset.data.map((point) => point.authoredOn))),
    }));
  }
}
