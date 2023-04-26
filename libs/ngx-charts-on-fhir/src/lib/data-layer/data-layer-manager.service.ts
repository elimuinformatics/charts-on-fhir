import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, merge, Observable, Subject, takeUntil } from 'rxjs';
import { DataLayer, DataLayerCollection, ManagedDataLayer } from './data-layer';
import { DataLayerColorService } from './data-layer-color.service';
import { DataLayerMergeService } from './data-layer-merge.service';
import produce, { castDraft } from 'immer';
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

  private stateSubject = new BehaviorSubject(initialState);
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
   */
  retrieveAll() {
    this.stateSubject.subscribe((state) => console.log(state));
    this.reset();
    this.loading$.next(true);
    merge(...this.dataLayerServices.map((service) => service.retrieve()))
      .pipe(takeUntil(this.cancel$))
      .subscribe({
        next: (layer) => {
          console.log('merging', layer);
          const layers = this.mergeService.merge(this.state.layers, layer);
          this.state = { ...this.state, layers };
        },
        error: (err) => console.error(err),
        complete: () => {
          this.loading$.next(false);
        },
      });
  }

  /** Reducer that returns a new state after applying the auto-select function */
  private autoSelectLayers = (state: DataLayerManagerState) => {
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

  /** Reducer that returns a new state with the given layer un-selected */
  private removeLayer = produce<DataLayerManagerState, [string]>((draft, id) => {
    draft.layers[id].selected = false;
    const index = draft.selected.indexOf(id);
    if (index >= 0) {
      draft.selected.splice(index, 1);
    }
  });

  /** Reducer that returns a new state after applying the auto-enable function */
  private autoEnableLayers = produce<DataLayerManagerState>((draft) => {
    if (draft.autoEnableFn) {
      for (let id in draft.layers) {
        draft.layers[id].enabled = draft.autoEnableFn(draft.layers[id]);
      }
    }
  });

  /** Reducer that returns a new state after applying the auto-sort function */
  private autoSortLayers = produce<DataLayerManagerState>((draft) => {
    if (draft.autoSortFn) {
      draft.selected.sort((idA, idB) => draft.autoSortFn!(draft.layers[idA], draft.layers[idB]));
    }
  });

  /** Reducer that returns a new state with the given layer selected */
  private selectLayer = produce<DataLayerManagerState, [string, string[]?]>((draft, id) => {
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

  /** Cancels any in-progress data retrieval and resets the DataLayerManager to its initial state */
  reset() {
    this.cancel$.next();
    this.state = { ...this.state, layers: {}, selected: [] };
    this.colorService.reset();
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
    console.log('remove', id);
    this.state = produce(this.state, (draft) => {
      const layer = draft.layers[id];
      layer.selected = false;
      const index = draft.selected.indexOf(id);
      draft.selected.splice(index, 1);
      draft.autoSelectFn = undefined;
    });
  }

  /** Enable or disable a layer. A disabled layer will still show up in
   * the list of selected layers, but will not be visible on the chart.
   * This will disable auto-enable. */
  enable(id: string, enabled = true) {
    if (!this.state.layers[id]) {
      throw new Error(`Layer [${id}] not found`);
    }
    this.state = produce(this.state, (draft) => {
      const layer = draft.layers[id];
      layer.enabled = enabled;
      for (let dataset of layer.datasets) {
        dataset.hidden = !enabled;
      }
      draft.autoEnableFn = undefined;
    });
  }

  /** Modify a layer's properties.
   * This method must be used to propagate the changes to other components.
   */
  update(layer: ManagedDataLayer) {
    console.log('update', layer);
    if (!this.state.layers[layer.id]) {
      throw new Error(`Layer [${layer.id}] not found`);
    }
    this.state = produce(this.state, (draft) => {
      draft.layers[layer.id] = castDraft(layer);
    });
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
}
