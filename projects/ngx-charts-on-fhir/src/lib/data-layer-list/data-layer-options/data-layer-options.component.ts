import { Component, EventEmitter, Input, Output } from '@angular/core';
import produce, { castDraft } from 'immer';
import { Dataset, ManagedDataLayer } from '../../data-layer/data-layer';

@Component({
  selector: 'data-layer-options',
  templateUrl: './data-layer-options.component.html',
})
export class DataLayerOptionsComponent {
  @Input() layer?: ManagedDataLayer;
  @Output() change = new EventEmitter<ManagedDataLayer>();

  onDatasetsChange(datasets: Dataset[]) {
    if (this.layer) {
      this.change.emit(
        produce(this.layer, (draft) => {
          draft.datasets = castDraft(datasets);
          draft.enabled = datasets.some((dataset) => !dataset.hidden);
        })
      );
    }
  }
}
