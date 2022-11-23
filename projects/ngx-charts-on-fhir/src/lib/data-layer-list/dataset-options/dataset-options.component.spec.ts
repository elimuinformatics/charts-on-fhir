import { Component, forwardRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { COLOR_PALETTE, DataLayerColorService } from '../../data-layer/data-layer-color.service';
import { DatasetOptionsComponent } from './dataset-options.component';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatasetOptionsComponent, MockColorPickerComponent],
      imports: [MatButtonModule, MatButtonToggleModule, MatSlideToggleModule, MatIconModule, ReactiveFormsModule],
      providers: [
        { provide: DataLayerColorService, useValue: mockColorService },
        { provide: COLOR_PALETTE, useValue: ['#000000', '#ffffff'] },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatasetOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
