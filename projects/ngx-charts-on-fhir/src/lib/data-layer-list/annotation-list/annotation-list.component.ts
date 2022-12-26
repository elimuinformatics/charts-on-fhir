import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import produce, { castDraft } from 'immer';

@Component({
  selector: 'annotation-list',
  templateUrl: './annotation-list.component.html',
  styleUrls: ['./annotation-list.component.css'],
})
export class AnnotationListComponent {
  public _annotations: any[] | undefined;

  @Input() set annotations(annotations: any[] | undefined) {
    this._annotations = annotations;
  }

  @Output() annotationsChange = new EventEmitter<any[]>();

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

  trackByIndex(index: any) {
    return index;
  }
}
