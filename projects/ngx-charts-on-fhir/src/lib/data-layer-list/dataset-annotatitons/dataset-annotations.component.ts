import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Annotation } from 'fhir/r2';
import produce from 'immer';
import { merge } from 'lodash-es';
import { Dataset, TimelineChartType } from '../../data-layer/data-layer';
import { DataLayerColorService } from '../../data-layer/data-layer-color.service';

@Component({
  selector: 'dataset-annotations',
  templateUrl: './dataset-annotations.component.html',
  styleUrls: ['./dataset-annotations.component.css'],
})
export class DatasetAnnotationsComponent implements OnInit {
  public _annotation?: any; 

  @Input() set annotation(annotation: Dataset) {
    this._annotation = annotation;
     console.log(this._annotation)
     this.updateForm(annotation);
  }


  @Output() onAnnotationsChange = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private colorService: DataLayerColorService) {}

  form = this.fb.group({
    color: this.fb.control('', { nonNullable: true }),
    label: this.fb.control('', { nonNullable: true }),
    yMax: this.fb.control('', { nonNullable: true }),
    yMin: this.fb.control('', { nonNullable: true }),
  });

  ngOnInit(): void {
  
    this.form.valueChanges.subscribe((value) => {
      this.updateModel(value);
    });


  }

  private updateModel(formValue: typeof this.form.value): void {
    console.log(formValue.label)
    if (this._annotation) {
      const props: any = {
        label: {
            "content": formValue.label
        },
        "yMax": formValue.yMax,
        "yMin": formValue.yMin
    }
      this.onAnnotationsChange.emit(
        produce(this._annotation, (draft: any) => {
          merge(draft, props);
          this.colorService.setColor(draft, formValue.color ?? '');
        })
      );
    }
  }

  private updateForm(annotation: any): void {
    this.form.patchValue({
      label: this._annotation.label.content,
      yMax: this._annotation.yMax,
      yMin: this._annotation.yMin,
      color : this._annotation.backgroundColor 
    });
  }
}
