import { Component, forwardRef, NO_ERRORS_SCHEMA } from '@angular/core';
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
    TestBed.configureTestingModule({
      declarations: [AnnotationOptionsComponent],
      providers: [FormBuilder],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(AnnotationOptionsComponent, {
        set: {
          providers: [{ provide: DataLayerColorService, useValue: colorService }],
        },
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AnnotationOptionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  });
  function updateForm(annotaionOptions: any) {
    component.form.controls['color'].setValue(annotaionOptions.color);
    component.form.controls['label'].setValue(annotaionOptions.label);
    component.form.controls['yMax'].setValue(annotaionOptions.yMax);
    component.form.controls['yMin'].setValue(annotaionOptions.yMin);
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form value should update from form changes', fakeAsync(() => {
    let annotaionOptions = { color: 'color', label: 'label', yMax: 80, yMin: 120 };
    updateForm(annotaionOptions);

    fixture.detectChanges();
    const updateModelSpy = spyOn<any>(component, 'updateModel');
    component['updateModel'](annotaionOptions);
    fixture.whenStable().then(() => {
      expect(component.form.value).toEqual(annotaionOptions);
      expect(updateModelSpy).toHaveBeenCalled();
    });
  }));
});
