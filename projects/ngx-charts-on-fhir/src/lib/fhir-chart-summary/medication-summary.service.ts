import { Injectable } from '@angular/core';
import { formatDate, MedicationDataPoint } from '../../public-api';
import { DataLayer, TimelineChartType } from '../data-layer/data-layer';
import { SummaryService } from './summary.service';

@Injectable({
  providedIn: 'root',
})
export class MedicationSummaryService implements SummaryService {
  canSummarize(layer: DataLayer): boolean {
    return layer.scale.type === 'medication';
  }
  summarize(layer: DataLayer<TimelineChartType, MedicationDataPoint[]>): Record<string, string>[] {
    return layer.datasets.map((dataset) => ({
      name: dataset.label ?? '(unknown)',
      'Authored On': formatDate(Math.max(...dataset.data.map((point) => point.authoredOn))),
    }));
  }
}