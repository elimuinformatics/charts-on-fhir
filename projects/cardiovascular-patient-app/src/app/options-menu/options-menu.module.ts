import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionsMenuComponent } from './options-menu.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
@NgModule({
  declarations: [OptionsMenuComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule, MatSlideToggleModule],
  exports: [OptionsMenuComponent],
})
export class OptionsMenuModule {}
