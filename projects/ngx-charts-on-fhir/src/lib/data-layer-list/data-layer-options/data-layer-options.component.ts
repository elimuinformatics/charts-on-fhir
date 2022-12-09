import { Component, EventEmitter, Input, Output } from '@angular/core';
import produce, { castDraft } from 'immer';
import { Dataset, ManagedDataLayer } from '../../data-layer/data-layer';

@Component({
  selector: 'data-layer-options',
  templateUrl: './data-layer-options.component.html',
  styleUrls: ['./data-layer-options.component.css'],
})
export class DataLayerOptionsComponent {
  @Input() layer?: ManagedDataLayer;
  @Output() layerChange = new EventEmitter<ManagedDataLayer>();

  onDatasetsChange(datasets: Dataset[]) {
    if (this.layer) {
      this.layerChange.emit(
        produce(this.layer, (draft) => {
          draft.datasets = castDraft(datasets);
          draft.enabled = datasets.some((dataset) => !dataset.hidden);
        })
      );
    }
  }
}
