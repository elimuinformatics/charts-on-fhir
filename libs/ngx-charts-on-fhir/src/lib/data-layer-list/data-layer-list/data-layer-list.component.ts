import { Component, Input } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ManagedDataLayer } from '../../data-layer/data-layer';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';

/**
 * See `*DataLayerList` for example usage.
 */
@Component({
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
