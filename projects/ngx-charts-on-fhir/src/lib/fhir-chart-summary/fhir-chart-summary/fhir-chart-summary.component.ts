import { Component } from '@angular/core';
import { Chart, ScatterDataPoint } from 'chart.js';
import { map, OperatorFunction, pipe, combineLatestWith, Observable, tap } from 'rxjs';
import { DateRange } from '../../analysis/analysis-card-content.component';
import { DataLayer, Dataset, ManagedDataLayer } from '../../data-layer/data-layer';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { MILLISECONDS_PER_DAY } from '../../utils';

type CardContext = {
  layer: DataLayer;
  dataset: Dataset;
  visibleData: ScatterDataPoint[];
  dateRange: DateRange;
};

@Component({
  selector: 'fhir-chart-summary',
  templateUrl: './fhir-chart-summary.component.html',
  styleUrls: ['./fhir-chart-summary.component.css'],
})
export class FhirChartSummaryComponent {
  constructor(private layerManager: DataLayerManagerService) {}
  cardContexts$ = this.layerManager.selectedLayers$.pipe(visibleDatasets(), filterByDateRange(this.layerManager.timelineRange$));
}

function visibleDatasets(): OperatorFunction<ManagedDataLayer[], { layer: DataLayer; dataset: Dataset }[]> {
  return pipe(
    map((layers) =>
      layers
        .filter((layer) => layer.enabled)
        .flatMap((layer) =>
          layer.datasets
            .filter((dataset) => !dataset.hidden)
            .sort(byMostRecentValue)
            .map((dataset) => ({ layer, dataset }))
        )
    )
  );
}

/** Comparison function that can be used to sort Datasets by their most recent y-value, descending */
function byMostRecentValue(a: Dataset, b: Dataset) {
  const ay = a.data.at(-1)?.y;
  const by = b.data.at(-1)?.y;
  if (ay == null || by == null) {
    return 0;
  }
  return by - ay;
}

function filterByDateRange(dateRange$: Observable<{ min: number; max: number }>): OperatorFunction<{ layer: DataLayer; dataset: Dataset }[], CardContext[]> {
  return pipe(
    combineLatestWith(dateRange$),
    map(([datasets, range]) =>
      datasets.map(({ layer, dataset }) => ({
        layer,
        dataset,
        visibleData: dataset.data.filter((point) => range.min <= point.x && point.x <= range.max),
        dateRange: {
          min: new Date(range.min),
          max: new Date(range.max),
          days: Math.ceil((range.max - range.min) / MILLISECONDS_PER_DAY),
        },
      }))
    )
  );
}
