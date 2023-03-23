import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerComponent } from './color-picker.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [ColorPickerComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, OverlayModule],
  exports: [ColorPickerComponent],
})
export class ColorPickerModule {}
