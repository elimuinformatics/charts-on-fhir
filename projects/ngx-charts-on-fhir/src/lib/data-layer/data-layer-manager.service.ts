import { forwardRef, Inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, merge, Observable, ReplaySubject } from 'rxjs';
import { DataLayer, DataLayerCollection, ManagedDataLayer } from './data-layer';
import { DataLayerColorService } from './data-layer-color.service';
import { DataLayerMergeService } from './data-layer-merge.service';
import produce, { castDraft } from 'immer';
import { DataLayerModule } from './data-layer.module';

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

/**
 * A service that retrieves [DataLayer]s from all registered [DataLayerService]s
 * and provides methods for selecting and ordering the layers.
 */
@Injectable({
  providedIn: forwardRef(() => DataLayerModule),
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
  selectedLayers$ = this.stateSubject.pipe(map(({ layers, selected }) => selected.map((id) => layers[id])));
  availableLayers$ = this.allLayers$.pipe(map((layers) => layers.filter((layer) => !layer.selected)));

  // todo: roll this into stateSubject?
  private timelineRangeSubject = new ReplaySubject<{ min: number; max: number }>();
  timelineRange$ = this.timelineRangeSubject.asObservable();

  loading = false;

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
  retrieveAll() {
    this.loading = true;
    merge(...this.dataLayerServices.map((service) => service.retrieve())).subscribe({
      next: (layer) =>
        this.stateSubject.next({
          ...this.stateSubject.value,
          layers: this.mergeService.merge(this.state.layers, layer),
        }),
      error: (err) => console.error(err),
      complete: () => (this.loading = false),
    });
  }

  select(id: string) {
    if (!this.state.layers[id]) {
      throw new Error(`No layer found with id [${id}]`);
    }
    this.stateSubject.next(
      produce(this.state, (draft) => {
        const layer = draft.layers[id];
        draft.selected.push(layer.id);
        layer.selected = true;
        layer.enabled = true;
        this.colorService.chooseColorsFromPalette(layer);
        if (layer.scales?.['timeline']) {
          layer.scales['timeline'].afterDataLimits = ({ max, min }) => this.timelineRangeSubject.next({ max, min });
        }
      })
    );
  }

  remove(id: string) {
    if (!this.state.layers[id]) {
      throw new Error(`No layer found with id [${id}]`);
    }
    this.stateSubject.next(
      produce(this.state, (draft) => {
        const layer = draft.layers[id];
        if (!layer.selected) {
          layer.selected = false;
          const index = draft.selected.indexOf(id);
          draft.selected.splice(index, 1);
        }
      })
    );
  }

  enable(id: string, enabled = true) {
    if (!this.state.layers[id]) {
      throw new Error(`No layer found with id [${id}]`);
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
      throw new Error(`No layer found with id [${layer.id}]`);
    }
    this.stateSubject.next(
      produce(this.state, (draft) => {
        draft.layers[layer.id] = castDraft(layer);
      })
    );
  }

  move(previousIndex: number, newIndex: number) {
    this.stateSubject.next(
      produce(this.state, (draft) => {
        const movedLayers = draft.selected.splice(previousIndex, 1);
        draft.selected.splice(newIndex, 0, ...movedLayers);
      })
    );
  }
}
