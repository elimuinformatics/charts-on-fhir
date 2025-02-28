import { Component, Input } from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { ManagedDataLayer } from '../../data-layer/data-layer';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DataLayerOptionsComponent } from '../data-layer-options/data-layer-options.component';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';

/**
 * See `*DataLayerList` for example usage.
 */
@Component({
  imports: [CommonModule, MatTooltipModule, MatIconModule, MatButtonModule, DataLayerOptionsComponent, MatCheckboxModule, MatExpansionModule, DragDropModule],
  selector: 'data-layer-list',
  templateUrl: './data-layer-list.component.html',
  styleUrls: ['./data-layer-list.component.css'],
})
export class DataLayerListComponent {
  @Input() hideRemoveLayerButton?: boolean = false;

  constructor(readonly layerManager: DataLayerManagerService) {}

  getLayerId(_index: number, layer: ManagedDataLayer) {
    return layer.id;
  }

  onDrop(event: CdkDragDrop<unknown>) {
    this.layerManager.move(event.previousIndex, event.currentIndex);
  }

  onDragHandlePointerDown(panel: MatExpansionPanel, event: Event) {
    panel.close();
    event.stopPropagation();
  }

  onCheckboxChange(layer: ManagedDataLayer, event: MatCheckboxChange) {
    this.layerManager.enable(layer.id, event.checked);
  }

  isCheckboxChecked(layer: ManagedDataLayer) {
    return layer.enabled;
  }

  isCheckboxIndeterminate(layer: ManagedDataLayer) {
    return layer.enabled && layer.datasets.some((dataset) => dataset.hidden);
  }

  onLayerChange(layer: ManagedDataLayer) {
    if (layer.id) {
      this.layerManager.update(layer);
    }
  }

  onLayerRemove(layer: ManagedDataLayer) {
    this.layerManager.remove(layer.id);
  }
}
