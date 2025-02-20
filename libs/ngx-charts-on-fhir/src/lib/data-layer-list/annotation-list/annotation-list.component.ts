import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { produce, castDraft } from 'immer';
import { AnnotationOptionsComponent } from '../annotation-options/annotation-options.component';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  imports: [CommonModule, MatExpansionModule, MatCheckboxModule, AnnotationOptionsComponent],
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

  onCheckboxChange(index: any, event: MatCheckboxChange) {
    if (this._annotations) {
      this.annotationsChange.emit(
        produce(this._annotations, (draft) => {
          draft[index].display = event.checked;
        }),
      );
    }
  }

  onAnnotationsChange(oldAnnotation: any, newAnnotation: any) {
    if (this._annotations) {
      const index = this._annotations.indexOf(oldAnnotation);
      this.annotationsChange.emit(
        produce(this._annotations, (draft) => {
          draft[index] = castDraft(newAnnotation);
        }),
      );
    }
  }

  trackByIndex(index: any) {
    return index;
  }
}
