import { Component, forwardRef } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DataLayerColorService } from '../../data-layer/data-layer-color.service';
import { AnnotationOptionsComponent } from './annotation-options.component';

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
  let palette: string[];
  beforeEach(async () => {
    colorService = new DataLayerColorService(palette);
    await TestBed.configureTestingModule({
      declarations: [AnnotationOptionsComponent],
      providers: [FormBuilder, { provide: DataLayerColorService, useValue: colorService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AnnotationOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  function updateForm(annotationOptions: any) {
    component.form.controls['color'].setValue(annotationOptions.color);
    component.form.controls['label'].setValue(annotationOptions.label);
    component.form.controls['yMax'].setValue(annotationOptions.yMax);
    component.form.controls['yMin'].setValue(annotationOptions.yMin);
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form value should update from form changes', fakeAsync(() => {
    let annotationOptions = { color: 'color', label: 'label', yMax: 80, yMin: 120 };
    updateForm(annotationOptions);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.form.value).toEqual(annotationOptions);
    });
  }));
});
