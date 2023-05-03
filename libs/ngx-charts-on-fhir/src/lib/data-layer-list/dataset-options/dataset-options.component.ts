import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Chart } from 'chart.js';
import produce from 'immer';
import { merge } from 'lodash-es';
import { Dataset, TimelineChartType } from '../../data-layer/data-layer';
import { DataLayerColorService } from '../../data-layer/data-layer-color.service';
import { SharedDataLayerListService } from '../shared-data-layer-list.service';

@Component({
  selector: 'dataset-options',
  templateUrl: './dataset-options.component.html',
  styleUrls: ['./dataset-options.component.css'],
})
export class DatasetOptionsComponent implements OnInit {
  _dataset?: Dataset;
  @Input() set dataset(dataset: Dataset) {
    this._dataset = dataset;
    this.updateForm(dataset);
  }
  @Output() datasetChange = new EventEmitter<Dataset>();

  constructor(private fb: FormBuilder, private colorService: DataLayerColorService, public sharedDataService: SharedDataLayerListService) {}

  get datasetLineOptions(): Dataset<'line'> {
    return this._dataset as Dataset<'line'>;
  }

  form = this.fb.group({
    color: this.fb.control('', { nonNullable: true }),
    type: this.fb.control<TimelineChartType>('line', { nonNullable: true }),
    pointStyle: this.fb.control('circle', { nonNullable: true }),
    pointRadius: this.fb.control(1, { nonNullable: true }),
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
        pointStyle: formValue.pointStyle,
        pointRadius: formValue.pointRadius,
        cubicInterpolationMode: formValue.interpolation ? 'monotone' : 'default',
        fill: formValue.fill ? 'stack' : false,
      };
      this.datasetChange.emit(
        produce(this._dataset, (draft) => {
          merge(draft, props);
          if (formValue.color) {
            this.colorService.setColor(draft, formValue.color ?? '');
          }
        })
      );
    }
  }

  private updateForm(dataset: Dataset): void {
    const line = dataset as Dataset<'line'>;
    this.form.patchValue({
      color: this.colorService.getColor(dataset),
      type: dataset.type ?? 'line',
      pointStyle: getPointStyle(dataset),
      pointRadius: getPointRadius(dataset),
      interpolation: line.cubicInterpolationMode === 'monotone',
      fill: !!line.fill,
    });
  }
}

function getPointStyle(dataset: Dataset) {
  if (dataset.pointStyle == null) {
    return 'circle';
  }
  if (typeof dataset.pointStyle === 'string') {
    return dataset.pointStyle;
  }
  return undefined;
}

function getPointRadius(dataset: Dataset) {
  const line = dataset as Dataset<'line'>;
  if (line.pointRadius == null && typeof Chart.defaults.elements.point.radius === 'number') {
    return Chart.defaults.elements.point.radius;
  }
  if (typeof line.pointRadius === 'number') {
    return line.pointRadius;
  }
  return undefined;
}
