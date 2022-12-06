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
  public _annotations: any[] | undefined; 

  @Input() set annotations(annotations: any[] | undefined) {
    this._annotations = annotations;
    console.log('annotations ====> ' , this._annotations)
 }

 @Output() annotationsChange = new EventEmitter<Dataset[]>();

  onCheckboxChange(annotation: any, event: MatCheckboxChange) {
    if (this._annotations) {
      const index = this._annotations.indexOf(annotation);
      this.annotationsChange.emit(
        produce(this._annotations, (draft) => {
          draft[index].display = event.checked;
        })
      );
    }
  }

  onAnnotationsChange(oldAnnotation: any, newAnnotation: any) {
    if (this._annotations) {
      const index = this._annotations.indexOf(oldAnnotation);
      this.annotationsChange.emit(
        produce(this._annotations, (draft) => {
          draft[index] = castDraft(newAnnotation);
        })
      );
    }
  }
  
  trackByIndex(index:any,value: any){
    return index;
  }
}
