import { Component, EventEmitter, Input, Output } from '@angular/core';
import { produce, castDraft } from 'immer';
import { Dataset, ManagedDataLayer } from '../../data-layer/data-layer';
import { CommonModule } from '@angular/common';
import { DatasetListComponent } from '../dataset-list/dataset-list.component';
import { AnnotationListComponent } from '../annotation-list/annotation-list.component';

@Component({
  imports: [CommonModule, DatasetListComponent, AnnotationListComponent],
  selector: 'data-layer-options',
  templateUrl: './data-layer-options.component.html',
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
        }),
      );
    }
  }

  onAnnotationsChange(annotations: any) {
    if (this.layer) {
      this.layerChange.emit(
        produce(this.layer, (draft) => {
          draft.annotations = castDraft(annotations);
        }),
      );
    }
  }
}
