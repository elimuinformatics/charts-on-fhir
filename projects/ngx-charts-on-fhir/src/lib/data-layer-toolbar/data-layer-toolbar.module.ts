import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataLayerToolbarComponent } from './data-layer-toolbar/data-layer-toolbar.component';
import { DataLayerToolbarButtonComponent } from './data-layer-toolbar-button/data-layer-toolbar-button.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [DataLayerToolbarComponent, DataLayerToolbarButtonComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, MatBadgeModule],
  exports: [DataLayerToolbarComponent],
})
export class DataLayerToolbarModule {}
