import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, distinctUntilChanged, EMPTY, map, merge, Observable, Subject, takeUntil } from 'rxjs';
import { DataLayer, DataLayerCollection, ManagedDataLayer } from './data-layer';
import { DataLayerColorService } from './data-layer-color.service';
import { DataLayerMergeService } from './data-layer-merge.service';
import { produce, castDraft } from 'immer';
import { zip } from 'lodash-es';
import { FhirChartTagsService } from '../fhir-chart-legend/fhir-chart-tags-legend/fhir-chart-tags.service';

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
  autoSelectFn?: (layer: DataLayer) => boolean;
  autoEnableFn?: (layer: DataLayer) => boolean;
  autoSortFn?: LayerCompareFn;
};

const initialState: DataLayerManagerState = {
  layers: {},
  selected: [],
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
@Injectable()
export class DataLayerManagerService {
  constructor(
    @Inject(DataLayerService) readonly dataLayerServices: DataLayerService[],
    private readonly colorService: DataLayerColorService,
    private readonly tagsService: FhirChartTagsService,
    private readonly mergeService: DataLayerMergeService
  ) {}
  dataRetrievalError$ = new BehaviorSubject<boolean>(false);
  private readonly stateSubject = new BehaviorSubject(initialState);
  private get state() {
    return this.stateSubject.value;
  }
  private set state(value: DataLayerManagerState) {
    let nextState = value;
    nextState = this.autoSelectLayers(nextState);
    nextState = this.autoEnableLayers(nextState);
    nextState = this.autoSortLayers(nextState);
    this.stateSubject.next(nextState);
  }

  allLayers$ = this.stateSubject.pipe(map(({ layers }) => Object.values(layers)));
  selectedLayers$ = this.stateSubject.pipe(
    map(({ layers, selected }) => selected.map((id) => layers[id])),
    distinctUntilChanged((previous, current) => previous.length === current.length && zip(previous, current).every(([p, c]) => p === c))
  );
  availableLayers$ = this.allLayers$.pipe(map((layers) => layers.filter((layer) => !layer.selected)));
  enabledLayers$ = this.selectedLayers$.pipe(
    map((layers) => layers.filter((layer) => layer.enabled)),
    distinctUntilChanged((previous, current) => previous.length === current.length && zip(previous, current).every(([p, c]) => p === c))
  );
  loading$ = new BehaviorSubject<boolean>(false);
  settings$ = this.stateSubject.pipe(
    map((state) => ({
      isAutoSelect: !!state.autoSelectFn,
      isAutoEnable: !!state.autoEnableFn,
      isAutoSort: !!state.autoSortFn,
    })),
    distinctUntilChanged()
  );

  private readonly cancel$ = new Subject<void>();

  /**
   * Retrieve layers from all of the injected `DataLayerService` implementations.
   *
   * This method subscribes to the Observables returned by each service's `retrieve()` method
   * and merges each emitted `DataLayer` with the previously emitted layers using the injected `DataLayerMergeService`.
   *
   * This method runs asynchronously and does not return anything.
   * You can observe the retrieved layers using one of the manager's Observable properties:
   * `allLayers$`, `selectedLayers$`, or `availableLayers$`.
   */
  retrieveAll() {
    this.reset();
    this.loading$.next(true);
    merge(
      ...this.dataLayerServices.map((service) =>
        service.retrieve().pipe(
          catchError((error) => {
            this.dataRetrievalError$.next(true);
            console.error(error);
            return EMPTY;
          })
        )
      )
    )
      .pipe(takeUntil(this.cancel$))
      .subscribe({
        next: (layer) => {
          const layers = this.mergeService.merge(this.state.layers, layer);
          this.state = { ...this.state, layers };
        },
        complete: () => {
          this.loading$.next(false);
        },
      });
  }

  /** Cancels any in-progress data retrieval and resets the DataLayerManager to its initial state */
  reset() {
    this.cancel$.next();
    this.state = { ...this.state, layers: {}, selected: [] };
    this.dataRetrievalError$.next(false);
  }

  /**
   * Automatically select layers for which the callback function returns true.
   * This will be done immediately and every time the layers change.
   * Manually selecting a layer (by calling `select`) will disable the auto-select function.
   * @param autoSelectFn `true`, `false`, or a callback function.
   */
  autoSelect(autoSelectFn: boolean | ((layer: DataLayer) => boolean)) {
    if (autoSelectFn === true) {
      autoSelectFn = () => true;
    } else if (autoSelectFn === false) {
      autoSelectFn = () => false;
    }
    this.state = { ...this.state, autoSelectFn };
  }

  /**
   * Automatically enable/disable layers for which the callback function returns true/false.
   * This will be done immediately and every time the layers change.
   * Manually enabling or disabling a layer (by calling `enable`) will disable the auto-enable function.
   * By default, all selected layers will be enabled.
   * @param autoEnableFn `true`, `false`, or a callback function.
   */
  autoEnable(autoEnableFn: boolean | ((layer: DataLayer) => boolean)) {
    if (autoEnableFn === true) {
      autoEnableFn = () => true;
    } else if (autoEnableFn === false) {
      autoEnableFn = () => false;
    }
    this.state = { ...this.state, autoEnableFn };
  }

  /**
   * Automatically sort selected layers based on the given comparison function.
   * This will be done immediately and every time the layers change.
   * Manually sorting the layers (by calling `move`) will disable the auto-sort function.
   * @param autoSortFn A comparison function that returns the relative sort order of its arguments (see `Array.sort`)
   */
  autoSort(autoSortFn: LayerCompareFn) {
    this.state = { ...this.state, autoSortFn };
  }

  /** Add a layer to the chart. This will disable auto-select. */
  select(id: string) {
    if (!this.state.layers[id]) {
      throw new Error(`Layer [${id}] not found`);
    }
    if (this.state.layers[id].selected) {
      throw new Error(`Layer [${id}] is already selected`);
    }
    this.state = {
      ...this.selectLayer(this.state, id),
      autoSelectFn: undefined,
    };
  }

  /** Remove a layer from the chart. This will disable auto-select. */
  remove(id: string) {
    if (!this.state.layers[id]) {
      throw new Error(`Layer [${id}] not found`);
    }
    if (!this.state.layers[id].selected) {
      throw new Error(`Layer [${id}] is not selected`);
    }
    this.state = {
      ...this.removeLayer(this.state, id),
      autoSelectFn: undefined,
    };
  }

  /** Enable or disable a layer. A disabled layer will still show up in
   * the list of selected layers, but will not be visible on the chart.
   * This will disable auto-enable. */
  enable(id: string, enabled = true) {
    if (!this.state.layers[id]) {
      throw new Error(`Layer [${id}] not found`);
    }
    this.state = {
      ...this.enableLayer(this.state, id, enabled),
      autoEnableFn: undefined,
    };
  }

  /** Modify a layer's properties.
   * If the layer's `selected` property is changed, this will disable auto-select.
   * If the layer's `enabled` or `dataset[].hidden` property is changed, this will disable auto-enable.
   */
  update(layer: ManagedDataLayer) {
    if (!this.state.layers[layer.id]) {
      throw new Error(`Layer [${layer.id}] not found`);
    }
    let nextState = produce(this.state, (draft) => {
      draft.layers[layer.id] = castDraft(layer);
    });
    const old = this.state.layers[layer.id];
    if (layer.selected !== old.selected) {
      nextState = {
        ...nextState,
        ...(layer.selected ? this.selectLayer(nextState, layer.id) : this.removeLayer(nextState, layer.id)),
        autoSelectFn: undefined,
      };
    }
    if (layer.enabled !== old.enabled || layer.datasets.some((d, i) => d.hidden !== old.datasets[i].hidden)) {
      nextState = {
        ...nextState,
        autoEnableFn: undefined,
      };
    }
    this.state = nextState;
  }

  /** Change the sort order of a layer. This will disable auto-sort. */
  move(previousIndex: number, newIndex: number) {
    if (previousIndex < 0 || previousIndex > this.state.selected.length) {
      throw new RangeError(`Index [${previousIndex}] is out of range [0 - ${this.state.selected.length}]`);
    }
    this.state = produce(this.state, (draft) => {
      const movedLayers = draft.selected.splice(previousIndex, 1);
      draft.selected.splice(newIndex, 0, ...movedLayers);
      draft.autoSortFn = undefined;
    });
  }

  /** Reducer that returns a new state after applying the auto-select function */
  private readonly autoSelectLayers = (state: DataLayerManagerState) => {
    let nextState = state;
    if (state.autoSelectFn) {
      for (let layer of Object.values(state.layers)) {
        if (state.autoSelectFn(layer)) {
          nextState = this.selectLayer(nextState, layer.id);
        } else {
          nextState = this.removeLayer(nextState, layer.id);
        }
      }
    }
    return nextState;
  };

  /** Reducer that returns a new state with the given layer selected */
  private readonly selectLayer = produce<DataLayerManagerState, [string, string[]?]>((draft, id) => {
    const layer = draft.layers[id];
    if (!draft.selected.includes(layer.id)) {
      draft.selected.push(layer.id);
    }
    if (!draft.layers[id].selected) {
      layer.selected = true;
      layer.enabled = true;
      this.colorService.chooseColorsFromPalette(layer);
      for (let dataset of layer.datasets) {
        this.tagsService.applyTagStyles(dataset);
      }
    }
  });

  /** Reducer that returns a new state with the given layer un-selected */
  private readonly removeLayer = produce<DataLayerManagerState, [string]>((draft, id) => {
    draft.layers[id].selected = false;
    const index = draft.selected.indexOf(id);
    if (index >= 0) {
      draft.selected.splice(index, 1);
    }
  });

  /** Reducer that returns a new state after applying the auto-enable function */
  private readonly autoEnableLayers = (state: DataLayerManagerState) => {
    let nextState = state;
    if (state.autoEnableFn) {
      for (let layer of Object.values(state.layers)) {
        nextState = this.enableLayer(nextState, layer.id, state.autoEnableFn(layer));
      }
    }
    return nextState;
  };

  /** Reducer that returns a new state with the given layer enabled/disabled */
  private readonly enableLayer = produce<DataLayerManagerState, [string, boolean]>((draft, id, enabled) => {
    const layer = draft.layers[id];
    layer.enabled = enabled;
    for (let dataset of layer.datasets) {
      dataset.hidden = !enabled;
    }
  });

  /** Reducer that returns a new state after applying the auto-sort function */
  private readonly autoSortLayers = produce<DataLayerManagerState>((draft) => {
    if (draft.autoSortFn) {
      draft.selected.sort((idA, idB) => draft.autoSortFn!(draft.layers[idA], draft.layers[idB]));
    }
  });
}
