import { Component, Inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { COLOR_PALETTE } from '../data-layer/data-layer-color.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, OverlayModule],
  selector: 'color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ColorPickerComponent,
    },
  ],
})
export class ColorPickerComponent implements ControlValueAccessor {
  constructor(@Inject(COLOR_PALETTE) readonly palette: string[]) {}

  selectedColor: string = '';
  isOpen = false;
  isDisabled = false;

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.selectedColor = value;
  }
  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }
  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onClick(color: string) {
    this.onTouched();
    if (color !== this.selectedColor) {
      this.selectedColor = color;
      this.onChange(color);
    }
    this.isOpen = false;
  }
}
