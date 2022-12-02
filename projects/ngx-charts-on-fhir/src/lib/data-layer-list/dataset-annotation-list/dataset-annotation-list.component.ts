import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import produce, { castDraft } from 'immer';
import { Dataset } from '../../data-layer/data-layer';

@Component({
  selector: 'dataset-annotation-list',
  templateUrl: './dataset-annotation-list.component.html',
  styleUrls: ['./dataset-annotation-list.component.css'],
})
export class DatasetAnnotationListComponent {
  datasetsReversed: Dataset[] | undefined;
  private _datasets: Dataset[] | undefined;
  public _annotations: any[] | undefined; 
  @Input() set datasets(datasets: Dataset[] | undefined) {
    this._datasets = datasets;
    this.datasetsReversed = datasets?.slice().reverse();
  }

  @Input() set annotations(annotations: any[] | undefined) {
    this._annotations = annotations;
    console.log('annotations ====> ' , this._annotations)
 }
 @Output() change = new EventEmitter<Dataset[]>();

  @Output() annotationsChange = new EventEmitter<Dataset[]>();

  onCheckboxChange(annotation: any, event: MatCheckboxChange) {
    if (this._annotations) {
      const index = this._annotations.indexOf(annotation);
      this.annotationsChange.emit(
        produce(this._annotations, (draft) => {
          draft[index].display = !event.checked;
        })
      );
    }
  }

  onDatasetOptionsChange(oldDataset: Dataset, newDataset: Dataset) {
    if (this._datasets) {
      const index = this._datasets.indexOf(oldDataset);
      this.change.emit(
        produce(this._datasets, (draft) => {
          draft[index] = castDraft(newDataset);
        })
      );
    }
  }
}
