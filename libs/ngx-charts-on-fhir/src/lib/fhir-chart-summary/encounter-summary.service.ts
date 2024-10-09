import { Injectable } from '@angular/core';
import { DataLayer } from '../data-layer/data-layer';
import { formatDateTime } from '../utils';
import { SummaryService } from './summary.service';
import { MappableEncounter, isMappableEncounter } from '../fhir-mappers/encounter/encounter-mapper.service';
import { groupBy } from 'lodash-es';

@Injectable()
export class EncounterSummaryService implements SummaryService {
  canSummarize(layer: DataLayer): boolean {
    return !!(layer.category?.includes('encounter') && layer.datasets?.some((d) => d.data.length && isMappableEncounter(d.data.at(-1)?.resource)));
  }
  summarize(layer: DataLayer): Record<string, string>[] {
    const groups = groupBy(layer.datasets, (dataset) => dataset.chartsOnFhir?.group ?? dataset.label);
    const datasets = Object.entries(groups).map(([label, ds]) => ({ ...ds[0], label, data: ds.flatMap((d) => d.data) }));
    const mostRecent = datasets.map((d) => d.data.at(-1)?.resource).sort(byPeriodStart)[0];
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

const byPeriodStart = (a: MappableEncounter, b: MappableEncounter) => {
  return new Date(b.period.start).getTime() - new Date(a.period.start).getTime();
};
