import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataLayerToolbarComponent } from './data-layer-toolbar/data-layer-toolbar.component';
import { DataLayerToolbarButtonComponent } from './data-layer-toolbar-button/data-layer-toolbar-button.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DataLayerToolbarLoadingIndicatorComponent } from './data-layer-toolbar-loading-indicator/data-layer-toolbar-loading-indicator.component';
@NgModule({
  declarations: [DataLayerToolbarComponent, DataLayerToolbarButtonComponent, DataLayerToolbarLoadingIndicatorComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, MatBadgeModule, MatProgressSpinnerModule],
  exports: [DataLayerToolbarComponent],
})
export class DataLayerToolbarModule {}
