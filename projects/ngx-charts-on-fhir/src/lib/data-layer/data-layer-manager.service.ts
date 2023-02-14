import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, merge, Observable, Subject, takeUntil } from 'rxjs';
import { DataLayer, DataLayerCollection, ManagedDataLayer } from './data-layer';
import { DataLayerColorService } from './data-layer-color.service';
import { DataLayerMergeService } from './data-layer-merge.service';
import produce, { castDraft } from 'immer';
import { zip } from 'lodash-es';

/** A service for asynchronously retrieving DataLayers */
export abstract class DataLayerService {
  abstract name: string;
  abstract retrieve: () => Observable<DataLayer>;
}

type DataLayerManagerState = {
  layers: DataLayerCollection;
  selected: string[];
};

const initialState: DataLayerManagerState = {
  layers: {},
  selected: [],
};

type LayerCompareFn = (a: DataLayer, b: DataLayer) => number;
/**
 * A service that retrieves [DataLayer]s from all registered [DataLayerService]s
 * and provides methods for selecting and ordering the layers.
 */
@Injectable({
  providedIn: 'root',
})
export class DataLayerManagerService {
  constructor(
    @Inject(DataLayerService) readonly dataLayerServices: DataLayerService[],
    private colorService: DataLayerColorService,
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
   * Retrieve layers from all of the injected [DataLayerService]s.
   *
   * This method subscribes to the Observables returned by each service's `retrieve()` method
   * and merges each emitted [DataLayer] with the previously emitted layers using the injected [DataLayerMergeService].
   *
   * This method runs asynchronously and does not return anything.
   * You can observe the retrieved layers using one of the manager's Observable properties:
   * [allLayers$], [selectedLayers$], or [availableLayers$].
   */
  retrieveAll(sortCompareFn: LayerCompareFn = () => 0, selectAll: boolean = false) {
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
          }
          nextState = this.sortLayers(nextState, sortCompareFn);
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
    return Object.keys(this.state.layers).reduce((nextState, id) => this.selectLayer(nextState, id), state);
  };

  /** Reducer that returns a new state with the given layer selected */
  private selectLayer = produce<DataLayerManagerState, [string]>((draft, id) => {
    if (!draft.layers[id].selected) {
      const layer = draft.layers[id];
      draft.selected.push(layer.id);
      layer.selected = true;
      layer.enabled = true;
      this.colorService.chooseColorsFromPalette(layer);
    }
  });

  /** Cancels any in-progress data retrieval and resets the DataLayerManager to its initial state */
  reset() {
    this.cancel$.next();
    this.stateSubject.next(initialState);
    this.colorService.reset();
  }

  select(id: string) {
    if (!this.state.layers[id]) {
      throw new Error(`Layer [${id}] not found`);
    }
    if (this.state.layers[id].selected) {
      throw new Error(`Layer [${id}] is already selected`);
    }
    this.stateSubject.next(this.selectLayer(this.state, id));
  }

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
