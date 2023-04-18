import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, merge, Observable, Subject, takeUntil } from 'rxjs';
import { DataLayer, DataLayerCollection, ManagedDataLayer } from './data-layer';
import { DataLayerColorService } from './data-layer-color.service';
import { DataLayerMergeService } from './data-layer-merge.service';
import produce, { castDraft } from 'immer';
import { zip } from 'lodash-es';
import { FhirChartTagsService } from '../fhir-chart-legend/fhir-chart-tags-legend/fhir-chart-tags.service';
import { CartesianScaleOptions } from 'chart.js';

/**
 * A service for asynchronously retrieving data layers.
 *
 * This abstract class is used as both an interface and an injection token.
 * Applications should implement a `DataLayerService` that retrieves data and converts it into `DataLayer` objects (see usage notes below).
 * `DataLayerManagerService` will call the `retrieve` method to get the available Data Layers from each provided `DataLayerService`.
 *
 * @usageNotes
 * Applications should implement a `DataLayerService` that retrieves data and converts it into `DataLayer` objects:
 * ```ts
 * // observation-layer.service.ts
 * @Injectable({ providedIn: 'root' })
 * export class ObservationLayerService implements DataLayerService {
 *   constructor(private fhir: FhirDataService, private converter: FhirConverter) {}
 *   name = 'Observations';
 *   retrieve = () => {
 *     return this.fhir.getPatientData<Observation>('Observation').pipe(
 *       mergeMap((bundle) =>
 *         from(this.converter.convert(bundle))
 *       )
 *     );
 *   };
 * }
 * ```
 * And then provide it as a `DataLayerService` in the root injector:
 * ```ts
 * // app.module.ts
 * @NgModule({
 *   providers: [
 *     { provide: DataLayerService, useExisting: ObservationLayerService, multi: true },
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
export abstract class DataLayerService {
  abstract name: string;
  abstract retrieve: () => Observable<DataLayer>;
}

type DataLayerManagerState = {
  layers: DataLayerCollection;
  selected: string[];
  focused: null | {
    id: string;
    originalWeight: number;
  };
};

const initialState: DataLayerManagerState = {
  layers: {},
  selected: [],
  focused: null,
};

type LayerCompareFn = (a: DataLayer, b: DataLayer) => number;
/**
 * A service that retrieves data layers from all provided `DataLayerService` implementations
 * and provides methods for selecting and ordering the layers.
 *
 * Applications should inject this service and call the `retrieveAll()` method to load the data.
 *
 * ```ts
 * @Component({...})
 * export class AppComponent implements OnInit {
 *   constructor(private layerManager: DataLayerManagerService) {}
 *   ngOnInit(): void {
 *     this.layerManager.retrieveAll();
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class DataLayerManagerService {
  constructor(
    @Inject(DataLayerService) readonly dataLayerServices: DataLayerService[],
    private colorService: DataLayerColorService,
    private tagsService: FhirChartTagsService,
    private mergeService: DataLayerMergeService
  ) {}

  private stateSubject = new BehaviorSubject<DataLayerManagerState>(initialState);
  private get state() {
    return this.stateSubject.value;
  }
  private set state(value: DataLayerManagerState) {
    this.stateSubject.next(value);
  }
  allLayers$ = this.stateSubject.pipe(map(({ layers }) => Object.values(layers)));
  selectedLayers$ = this.stateSubject.pipe(
    map(({ layers, selected }) => selected.map((id) => layers[id])),
    distinctUntilChanged((previous, current) => previous.length === current.length && zip(previous, current).every(([p, c]) => p === c))
  );
  availableLayers$ = this.allLayers$.pipe(map((layers) => layers.filter((layer) => !layer.selected)));
  enabledLayers$ = this.selectedLayers$.pipe(map((layers) => layers.filter((layer) => layer.enabled)));
  loading$ = new BehaviorSubject<boolean>(false);

  private cancel$ = new Subject<void>();

  /**
   * Retrieve layers from all of the injected `DataLayerService` implementations.
   *
   * This method subscribes to the Observables returned by each service's `retrieve()` method
   * and merges each emitted `DataLayer` with the previously emitted layers using the injected `DataLayerMergeService`.
   *
   * This method runs asynchronously and does not return anything.
   * You can observe the retrieved layers using one of the manager's Observable properties:
   * `allLayers$`, `selectedLayers$`, or `availableLayers$`.
   *
   * @param selectAll When `true`, every layer that is retrieved will be automatically selected.
   * @param sortCompareFn A comparison function for sorting auto-selected layers. This function will be passed to `Array.sort`.
   */
  retrieveAll(selectAll: boolean = false, sortCompareFn: LayerCompareFn = () => 0) {
    this.reset();
    this.loading$.next(true);
    merge(...this.dataLayerServices.map((service) => service.retrieve()))
      .pipe(takeUntil(this.cancel$))
      .subscribe({
        next: (layer) => {
          const layers = this.mergeService.merge(this.state.layers, layer);
          let nextState = { ...this.stateSubject.value, layers };
          if (selectAll) {
            nextState = this.selectAllLayers(nextState);
            nextState = this.sortLayers(nextState, sortCompareFn);
          }
          this.stateSubject.next(nextState);
        },
        error: (err) => console.error(err),
        complete: () => {
          this.loading$.next(false);
        },
      });
  }

  /** Reducer that returns a new state with selected layers sorted by `sortCompareFn` */
  private sortLayers = produce<DataLayerManagerState, [LayerCompareFn]>((draft, sortCompareFn) => {
    draft.selected.sort((idA, idB) => sortCompareFn(draft.layers[idA], draft.layers[idB]));
  });

  /** Reducer that returns a new state with all layers selected */
  private selectAllLayers = (state: DataLayerManagerState) => {
    return Object.keys(state.layers).reduce((nextState, id) => this.selectLayer(nextState, id), state);
  };

  /** Reducer that returns a new state with the given layer selected */
  private selectLayer = produce<DataLayerManagerState, [string]>((draft, id) => {
    if (!draft.layers[id].selected) {
      const layer = draft.layers[id];
      draft.selected.push(layer.id);
      layer.selected = true;
      layer.enabled = true;
      this.colorService.chooseColorsFromPalette(layer);
      for (let dataset of layer.datasets) {
        this.tagsService.applyTagStyles(dataset);
      }
    }
  });

  /** Cancels any in-progress data retrieval and resets the DataLayerManager to its initial state */
  reset() {
    this.cancel$.next();
    this.stateSubject.next(initialState);
    this.colorService.reset();
  }

  /** Add a layer to the chart */
  select(id: string) {
    if (!this.state.layers[id]) {
      throw new Error(`Layer [${id}] not found`);
    }
    if (this.state.layers[id].selected) {
      throw new Error(`Layer [${id}] is already selected`);
    }
    this.stateSubject.next(this.selectLayer(this.state, id));
  }

  /** Remove a layer from the chart */
  remove(id: string) {
    if (!this.state.layers[id]) {
      throw new Error(`Layer [${id}] not found`);
    }
    if (!this.state.layers[id].selected) {
      throw new Error(`Layer [${id}] is not selected`);
    }
    this.stateSubject.next(
      produce(this.state, (draft) => {
        const layer = draft.layers[id];
        layer.selected = false;
        const index = draft.selected.indexOf(id);
        draft.selected.splice(index, 1);
      })
    );
  }

  /** Enable or disable a layer. A disabled layer will still show up in
   * the list of selected layers, but will not be visible on the chart. */
  enable(id: string, enabled = true) {
    if (!this.state.layers[id]) {
      throw new Error(`Layer [${id}] not found`);
    }
    this.stateSubject.next(
      produce(this.state, (draft) => {
        const layer = draft.layers[id];
        layer.enabled = enabled;
        for (let dataset of layer.datasets) {
          dataset.hidden = !enabled;
        }
      })
    );
  }

  /** Focus a layer so it takes up a larger portion of the screen */
  focus(id: string, height: number) {
    if (!this.state.layers[id]) {
      throw new Error(`Layer [${id}] not found`);
    }
    let nextState = this.unfocusLayer(this.state);
    if (!this.state.focused || this.state.focused.id !== id) {
      nextState = this.focusLayer(nextState, id, height);
    }
    this.stateSubject.next(nextState);
  }

  /** Reducer that returns a new state with the given layer focused */
  private focusLayer = produce<DataLayerManagerState, [string, number]>((draft, id, height) => {
    const layer = draft.layers[id];
    const scale = layer.scale as CartesianScaleOptions;
    const originalWeight = scale?.stackWeight ?? 1;
    draft.focused = { id, originalWeight };
    scale.stackWeight = (1.2 + 0.3 * draft.selected.length) * originalWeight;
    layer.focused = true;
  });

  /** Reducer that returns a new state without a focused layer */
  private unfocusLayer = produce<DataLayerManagerState>((draft) => {
    if (draft.focused) {
      const prevLayer = draft.layers[draft.focused.id];
      const prevScale = prevLayer.scale as CartesianScaleOptions;
      prevScale.stackWeight = draft.focused.originalWeight;
      prevLayer.focused = false;
      draft.focused = null;
    }
  });

  /** Modify a layer's properties.
   * This method must be used to propagate the changes to other components.
   */
  update(layer: ManagedDataLayer) {
    if (!this.state.layers[layer.id]) {
      throw new Error(`Layer [${layer.id}] not found`);
    }
    this.stateSubject.next(
      produce(this.state, (draft) => {
        draft.layers[layer.id] = castDraft(layer);
      })
    );
  }

  /** Change the sort order of a layer */
  move(previousIndex: number, newIndex: number) {
    if (previousIndex < 0 || previousIndex > this.state.selected.length) {
      throw new RangeError(`Index [${previousIndex}] is out of range [0 - ${this.state.selected.length}]`);
    }
    this.stateSubject.next(
      produce(this.state, (draft) => {
        const movedLayers = draft.selected.splice(previousIndex, 1);
        draft.selected.splice(newIndex, 0, ...movedLayers);
      })
    );
  }
}
