import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import produce from 'immer';
import { merge } from 'lodash-es';
import { DataLayerColorService } from '../../data-layer/data-layer-color.service';

@Component({
  selector: 'annotation-options',
  templateUrl: './annotation-options.component.html',
  styleUrls: ['./annotation-options.component.css'],
})
export class AnnotationOptionsComponent implements OnInit {
  private _annotation?: any;

  @Input() set annotation(annotation: any) {
    this._annotation = annotation;
    this.updateForm(annotation);
  }

  @Output() annotationChange = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private colorService: DataLayerColorService) {}

  form = this.fb.group({
    color: this.fb.control('', { nonNullable: true }),
    label: this.fb.control('', { nonNullable: true }),
    yMax: this.fb.control(0, { nonNullable: true }),
    yMin: this.fb.control(0, { nonNullable: true }),
  });

  ngOnInit(): void {
    this.form.valueChanges.subscribe((value) => {
      this.updateModel(value);
    });
  }

  private updateModel(formValue: typeof this.form.value): void {
    if (this._annotation) {
      let props = {
        label: {
          content: formValue.label,
        },
        yMax: formValue.yMax,
        yMin: formValue.yMin,
        backgroundColor: this.colorService.addTransparencyAbritraryColor(formValue.color),
      };
      this.annotationChange.emit(
        produce(this._annotation, (draft: any) => {
          merge(draft, props);
        })
      );
    }
  }

  private updateForm(annotation: any): void {
    if (this._annotation) {
      this.form.patchValue({
        label: annotation.label.content,
        yMax: annotation.yMax,
        yMin: annotation.yMin,
        color: annotation.backgroundColor,
      });
    }
  }
}
