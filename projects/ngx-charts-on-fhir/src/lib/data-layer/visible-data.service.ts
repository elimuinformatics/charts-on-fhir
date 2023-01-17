import { forwardRef, Injectable } from '@angular/core';
import { ScatterDataPoint } from 'chart.js';
import { OperatorFunction, pipe, map, Observable, combineLatestWith } from 'rxjs';
import { ManagedDataLayer, DataLayer, Dataset } from './data-layer';
import { DataLayerManagerService } from './data-layer-manager.service';
import { isValidScatterDataPoint, MILLISECONDS_PER_DAY, NumberRange } from '../utils';
import { DataLayerModule } from './data-layer.module';

export type VisibleData = {
  layer: DataLayer;
  datasets: {
    label?: string;
    visible: DataSlice;
    previous: DataSlice;
  }[];
};

export type DataSlice = {
  data: ScatterDataPoint[];
  dateRange: DateRange;
};

export type DateRange = {
  min: Date;
  max: Date;
  days: number;
};

/** A service that filters data based on the current bounds of the chart's timeline scale */
@Injectable({
  providedIn: forwardRef(() => DataLayerModule),
})
export class VisibleDataService {
  constructor(private layerManager: DataLayerManagerService) {}
  // visible$ = this.layerManager.selectedLayers$.pipe(visibleLayers(), addVisibleData(this.layerManager.timelineRange$));
}

function visibleLayers(): OperatorFunction<ManagedDataLayer[], ManagedDataLayer[]> {
  return pipe(map((layers) => layers.filter((layer) => layer.enabled)));
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
  return 0;
}

// function addVisibleData(dateRange$: Observable<NumberRange>): OperatorFunction<ManagedDataLayer[], VisibleData[]> {
//   return pipe(
//     combineLatestWith(dateRange$),
//     map(([layers, range]) =>
//       layers.map((layer) => ({
//         layer,
//         datasets: layer.datasets.map((dataset) => ({
//           label: dataset.label,
//           visible: filterByDateRange(dataset.data, range),
//           previous: filterByDateRange(dataset.data, previous(range)),
//         })),
//       }))
//     )
//   );
// }

