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
  writeValue(obj: any): void { /* TODO document why this method 'writeValue' is empty */ }
  registerOnChange(fn: any): void { /* TODO document why this method 'registerOnChange' is empty */ }
  registerOnTouched(fn: any): void { /* TODO document why this method 'registerOnTouched' is empty */ }
  setDisabledState?(isDisabled: boolean): void { /* TODO document why this method 'setDisabledState' is empty */ }
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
});
