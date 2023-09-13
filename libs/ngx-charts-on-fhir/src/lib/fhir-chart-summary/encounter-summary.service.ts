import { Injectable } from '@angular/core';
import { DataLayer } from '../data-layer/data-layer';
import { formatDateTime } from '../utils';
import { SummaryService } from './summary.service';
import { isMappableEncounter } from '../fhir-mappers/encounter/encounter-mapper.service';

@Injectable({
  providedIn: 'root',
})
export class EncounterSummaryService implements SummaryService {
  canSummarize(layer: DataLayer): boolean {
    return !!(layer.category?.includes('encounter') && layer.datasets?.[0]?.data.length && isMappableEncounter(layer.datasets[0].data.at(-1)?.resource));
  }
  summarize(layer: DataLayer): Record<string, string>[] {
    const mostRecent = layer.datasets[0].data.at(-1)?.resource;
    return [
      {
        'Most Recent Encounter': 'Type',
        '': mostRecent.type?.[0]?.text ?? '(unknown)',
      },
      {
        'Most Recent Encounter': 'Start',
        '': formatDateTime(mostRecent.period.start),
      },
      {
        'Most Recent Encounter': 'End',
        '': mostRecent.period.end ? formatDateTime(mostRecent.period.end) : '(unknown)',
      },
    ];
  }
}
