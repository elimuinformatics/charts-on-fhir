import { Component, forwardRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { COLOR_PALETTE, DataLayerColorService } from '../../data-layer/data-layer-color.service';
import { AnnotationOptionsComponent } from './annotation-options.component';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnotationOptionsComponent, MockColorPickerComponent],
      imports: [MatButtonModule, MatButtonToggleModule, MatSlideToggleModule, MatIconModule, ReactiveFormsModule],
      providers: [
        { provide: DataLayerColorService, useValue: mockColorService },
        { provide: COLOR_PALETTE, useValue: ['#000000', '#ffffff'] },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AnnotationOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('called private updateModel method', () => {
    let spyon = spyOn<any>(component, 'updateModel');
    let formValue: any = { color: '#377eb8', label: 'Systolic Blood Pressure Reference Range', yMax: 130, yMin: 90 };
    component['updateModel'](formValue);
    expect(spyon).toHaveBeenCalled();
  });

  it('when updateModel called it should emit event', () => {
    let formValue: any = { color: '#377eb8', label: 'Systolic Blood Pressure Reference Range', yMax: 130, yMin: 90 };
    const emitSpy = spyOn(component.onAnnotationsChange, 'emit');
    component._annotation = {
      label: {
        display: true,
        position: { x: 'start', y: 'end' },
        color: '#666666',
        font: { size: 16, weight: 'normal' },
        content: 'Systolic Blood Pressure Reference Range',
      },
      type: 'box',
      backgroundColor: '#ECF0F9',
      borderWidth: 0,
      drawTime: 'beforeDraw',
      display: true,
      yScaleID: 'mm[Hg]',
      yMax: 130,
      yMin: 90,
    };
    component['updateModel'](formValue);
    expect(emitSpy).toHaveBeenCalled();
  });
  it('called private updateForm method', () => {
    let spyon = spyOn<any>(component, 'updateForm');
    let annotation: any = {
      label: {
        display: true,
        position: { x: 'start', y: 'end' },
        color: '#666666',
        font: { size: 16, weight: 'normal' },
        content: 'Systolic Blood Pressure Reference Range',
      },
      type: 'box',
      backgroundColor: '#377eb8',
      borderWidth: 0,
      drawTime: 'beforeDraw',
      display: true,
      yScaleID: 'mm[Hg]',
      yMax: 130,
      yMin: 90,
    };
    component['updateForm'](annotation);
    expect(spyon).toHaveBeenCalled();
  });
});
