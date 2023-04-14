import { Injectable } from '@angular/core';
import { formatDate } from '../utils';
import { MedicationDataPoint } from '../fhir-mappers/medication-request/simple-medication-mapper.service';
import { DataLayer, TimelineChartType } from '../data-layer/data-layer';
import { SummaryService } from './summary.service';

@Injectable({
  providedIn: 'root',
})
export class MedicationSummaryService implements SummaryService {
  canSummarize(layer: DataLayer): boolean {
    return layer.scale.type === 'category';
  }
  summarize(layer: DataLayer<TimelineChartType, MedicationDataPoint[]>): Record<string, string>[] {
    return layer.datasets.map((dataset) => ({
      [layer.name]: dataset.label ?? '(unknown)',
      'Date Written': formatDate(Math.max(...dataset.data.map((point) => point.authoredOn))),
    }));
  }
}
