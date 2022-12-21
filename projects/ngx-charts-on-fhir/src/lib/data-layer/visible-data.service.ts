import { forwardRef, Injectable } from '@angular/core';
import { ScatterDataPoint } from 'chart.js';
import { OperatorFunction, pipe, map, Observable, combineLatestWith } from 'rxjs';
import { DateRange } from '../analysis/analysis-card-content.component';
import { ManagedDataLayer, DataLayer, Dataset } from './data-layer';
import { DataLayerManagerService } from './data-layer-manager.service';
import { isValidScatterDataPoint, MILLISECONDS_PER_DAY } from '../utils';
import { DataLayerModule } from './data-layer.module';

export type VisibleData = {
  layer: DataLayer;
  dataset: Dataset;
  data: ScatterDataPoint[];
  dateRange: DateRange;
};

/** A service that filters data based on the current bounds of the chart's timeline scale */
@Injectable({
  providedIn: forwardRef(() => DataLayerModule),
})
export class VisibleDataService {
  constructor(private layerManager: DataLayerManagerService) {}
  visible$ = this.layerManager.selectedLayers$.pipe(visibleDatasets(), filterByDateRange(this.layerManager.timelineRange$));
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
  if (typeof ay === 'number' && typeof by === 'number') {
    return by - ay;
  }
  throw new TypeError('Unsupported y-value types');
}

function filterByDateRange(dateRange$: Observable<{ min: number; max: number }>): OperatorFunction<{ layer: DataLayer; dataset: Dataset }[], VisibleData[]> {
  return pipe(
    combineLatestWith(dateRange$),
    map(([datasets, range]) =>
      datasets.map(({ layer, dataset }) => ({
        layer,
        dataset,
        data: dataset.data.filter(isValidScatterDataPoint).filter((point) => range.min <= point.x && point.x <= range.max),
        dateRange: {
          min: new Date(range.min),
          max: new Date(range.max),
          days: Math.ceil((range.max - range.min) / MILLISECONDS_PER_DAY),
        },
      }))
    )
  );
}
