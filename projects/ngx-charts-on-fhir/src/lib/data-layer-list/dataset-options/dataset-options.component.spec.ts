import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, forwardRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonToggleGroupHarness } from '@angular/material/button-toggle/testing';
import { MatSliderThumbHarness } from '@angular/material/slider/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { COLOR_PALETTE, DataLayerColorService } from '../../data-layer/data-layer-color.service';
import { DatasetOptionsComponent } from './dataset-options.component';
import { Chart } from 'chart.js';

const mockColorService = {
  getColor: () => '#000000',
  setColor: () => {},
};

@Component({
  selector: 'color-picker',
  template: '',
  providers: [{ provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => MockColorPickerComponent) }],
})
class MockColorPickerComponent implements ControlValueAccessor {
  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}
}

describe('DatasetOptionsComponent', () => {
  let component: DatasetOptionsComponent;
  let fixture: ComponentFixture<DatasetOptionsComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatasetOptionsComponent, MockColorPickerComponent],
      imports: [MatButtonModule, MatButtonToggleModule, MatSlideToggleModule, MatSliderModule, MatIconModule, ReactiveFormsModule],
      providers: [
        { provide: DataLayerColorService, useValue: mockColorService },
        { provide: COLOR_PALETTE, useValue: ['#000000', '#ffffff'] },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatasetOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit datasetChange event when pointStyle is changed', waitForAsync(async () => {
    let emitted: any = null;
    component.dataset = { label: 'Dataset', data: [] };
    component.datasetChange.subscribe((e) => (emitted = e));
    const pointStyle = await loader.getHarness(MatButtonToggleGroupHarness.with({ selector: "[formControlName='pointStyle']" }));
    const button = (await pointStyle.getToggles({ text: 'square' }))[0];
    await button.check();
    if (!emitted) {
      throw new Error('datasetChange should emit a dataset');
    }
    expect(emitted.pointStyle).toEqual('rect');
  }));

  it('should emit datasetChange event when point size is changed', waitForAsync(async () => {
    let emitted: any = null;
    component.dataset = { label: 'Dataset', data: [] };
    component.datasetChange.subscribe((e) => (emitted = e));
    const pointRadius = await loader.getHarness(MatSliderThumbHarness.with({ selector: "[formControlName='pointRadius']" }));
    await pointRadius.setValue(10);
    if (!emitted) {
      throw new Error('datasetChange should emit a dataset');
    }
    expect(emitted.pointRadius).toEqual(10);
  }));

  it('should update the form when dataset is changed', waitForAsync(async () => {
    component.dataset = { label: 'Dataset', data: [], pointStyle: 'rect' };
    const pointStyle = await loader.getHarness(MatButtonToggleGroupHarness.with({ selector: "[formControlName='pointStyle']" }));
    const button = (await pointStyle.getToggles({ text: 'square' }))[0];
    await button.isChecked();
    expect(await button.isChecked()).toEqual(true);
  }));

  it('should use chart default if point size is undefined', waitForAsync(async () => {
    Chart.defaults.elements.point.radius = 3;
    component.dataset = { label: 'Dataset', data: [] };
    const pointRadius = await loader.getHarness(MatSliderThumbHarness.with({ selector: "[formControlName='pointRadius']" }));
    expect(await pointRadius.getValue()).toEqual(3);
  }));

});
