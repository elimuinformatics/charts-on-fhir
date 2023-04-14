import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DataLayerColorService } from '../../data-layer/data-layer-color.service';
import { AnnotationOptionsComponent } from './annotation-options.component';
import { MatInputHarness } from '@angular/material/input/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, forwardRef } from '@angular/core';

@Component({
  selector: 'color-picker',
  template: '',
  providers: [{ provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => MockColorPickerComponent) }],
})
class MockColorPickerComponent implements ControlValueAccessor {
  writeValue(obj: any): void {
    /* intentionally empty stub */
  }
  registerOnChange(fn: any): void {
    /* intentionally empty stub */
  }
  registerOnTouched(fn: any): void {
    /* intentionally empty stub */
  }
  setDisabledState?(isDisabled: boolean): void {
    /* intentionally empty stub */
  }
}

describe('AnnotationOptionsComponent', () => {
  let component: AnnotationOptionsComponent;
  let fixture: ComponentFixture<AnnotationOptionsComponent>;
  let colorService: DataLayerColorService;
  let palette: string[] = ['#FFFFFF', '#121212', '#000000'];
  let loader: HarnessLoader;

  beforeEach(async () => {
    colorService = new DataLayerColorService(palette);
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NoopAnimationsModule, MatInputModule, MatFormFieldModule],
      declarations: [AnnotationOptionsComponent, MockColorPickerComponent],
      providers: [FormBuilder, { provide: DataLayerColorService, useValue: colorService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AnnotationOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update annotation label when input is changed', async () => {
    let emitted: any = null;
    component.annotation = { label: { content: 'Old' } };
    component.annotationChange.subscribe((e) => (emitted = e));
    const labelInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='annotationLabel']" }));
    await labelInputHarness.setValue('New');
    expect(emitted.label.content).toEqual('New');
  });

  it('should update annotation yMax when input is changed', async () => {
    let emitted: any = null;
    component.annotation = { color: 'color', label: { content: 'Old' }, type: 'box', yMax: 100, yMin: 50 };
    component.annotationChange.subscribe((e) => (emitted = e));
    const yMaxInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='yMax']" }));
    await yMaxInputHarness.setValue('110');
    expect(emitted.yMax).toEqual(110);
  });

  it('should update annotation yMin when input is changed', async () => {
    let emitted: any = null;
    component.annotation = { color: 'color', label: { content: 'Old' }, type: 'box', yMax: 100, yMin: 50 };
    component.annotationChange.subscribe((e) => (emitted = e));
    let yMinInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='yMin']" }));
    await yMinInputHarness.setValue('60');
    expect(emitted.yMin).toBe(60);
  });

  it('should update form when input is change', async () => {
    let annotation = { label: { content: 'Test' }, type: 'box', yMin: 100, yMax: 200 };
    component.annotation = annotation;
    let labelInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='annotationLabel']" }));
    let yMinInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='yMin']" }));
    let yMaxInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='yMax']" }));
    expect(await labelInputHarness.getValue()).toBe('Test');
    expect(await yMinInputHarness.getValue()).toBe('100');
    expect(await yMaxInputHarness.getValue()).toBe('200');
  });

  it('should emit annotation change event with updated annotations', async () => {
    let annotation = { label: { content: 'Test' }, type: 'box', yMin: 100, yMax: 200, backgroundColor: '#FFFFFF' };
    let updatedAnnotation = { label: { content: 'Updated test' }, type: 'box', yMin: 100, yMax: 200, backgroundColor: 'rgba(255, 255, 255, 0.2)' };
    component.annotation = annotation;
    let emitted: any;
    component.annotationChange.subscribe((e: any) => {
      emitted = e;
    });
    let labelInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='annotationLabel']" }));
    await labelInputHarness.setValue('Updated test');
    expect(emitted).toEqual(updatedAnnotation);
  });
});
