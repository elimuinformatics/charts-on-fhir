import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import produce, { castDraft } from 'immer';
import { Dataset } from '../../data-layer/data-layer';

@Component({
  selector: 'dataset-list',
  templateUrl: './dataset-list.component.html',
  styleUrls: ['./dataset-list.component.css'],
})
export class DatasetListComponent {
  datasetsReversed: Dataset[] | undefined;
  private _datasets: Dataset[] | undefined;
  @Input() set datasets(datasets: Dataset[] | undefined) {
    this._datasets = datasets;
    if(datasets?.slice()[0].yAxisID=='medications'){
      this.datasetsReversed = datasets?.slice()
    }else{
      this.datasetsReversed = datasets?.slice().reverse()
    }
  }
  @Output() datasetsChange = new EventEmitter<Dataset[]>();

  onCheckboxChange(dataset: Dataset, event: MatCheckboxChange) {
    if (this._datasets) {
      const index = this._datasets.indexOf(dataset);
      this.datasetsChange.emit(
        produce(this._datasets, (draft) => {
          draft[index].hidden = !event.checked;
        })
      );
    }
  }

  onDatasetOptionsChange(oldDataset: Dataset, newDataset: Dataset) {
    if (this._datasets) {
      const index = this._datasets.indexOf(oldDataset);
      this.datasetsChange.emit(
        produce(this._datasets, (draft) => {
          draft[index] = castDraft(newDataset);
        })
      );
    }
  }
}
