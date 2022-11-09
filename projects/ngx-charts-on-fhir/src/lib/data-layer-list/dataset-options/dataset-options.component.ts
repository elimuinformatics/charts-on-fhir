import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import produce from 'immer';
import { merge } from 'lodash-es';
import { Dataset, TimelineChartType } from '../../data-layer/data-layer';
import { DataLayerColorService } from '../../data-layer/data-layer-color.service';

@Component({
  selector: 'dataset-options',
  templateUrl: './dataset-options.component.html',
  styleUrls: ['./dataset-options.component.css'],
})
export class DatasetOptionsComponent implements OnInit {
  private _dataset?: Dataset;
  @Input() set dataset(dataset: Dataset) {
    this._dataset = dataset;
    this.updateForm(dataset);
  }
  @Output() change = new EventEmitter<Dataset>();

  constructor(private fb: FormBuilder, private colorService: DataLayerColorService) {}

  get datasetLineOptions(): Dataset<'line'> {
    return this._dataset as Dataset<'line'>;
  }

  form = this.fb.group({
    color: this.fb.control('', { nonNullable: true }),
    type: this.fb.control<TimelineChartType>('line', { nonNullable: true }),
    interpolation: this.fb.control(false, { nonNullable: true }),
    fill: this.fb.control(false, { nonNullable: true }),
  });

  ngOnInit(): void {
    this.form.valueChanges.subscribe((value) => {
      this.updateModel(value);
    });
  }

  private updateModel(formValue: typeof this.form.value): void {
    if (this._dataset) {
      const props: Partial<Dataset> = {
        type: formValue.type,
        cubicInterpolationMode: formValue.interpolation ? 'monotone' : 'default',
        fill: formValue.fill ? 'stack' : false,
      };
      this.change.emit(
        produce(this._dataset, (draft) => {
          merge(draft, props);
          this.colorService.setColor(draft, formValue.color ?? '');
        })
      );
    }
  }

  private updateForm(dataset: Dataset): void {
    const line = dataset as Dataset<'line'>;
    this.form.patchValue({
      color: this.colorService.getColor(dataset),
      type: dataset.type ?? 'line',
      interpolation: line.cubicInterpolationMode === 'monotone',
      fill: !!line.fill,
    });
  }
}
