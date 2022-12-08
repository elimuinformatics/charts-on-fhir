import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';

@Component({
  selector: 'data-layer-toolbar',
  templateUrl: './data-layer-toolbar.component.html',
  styleUrls: ['./data-layer-toolbar.component.css'],
})
export class DataLayerToolbarComponent implements OnChanges {
  @Input() active: string | null = null;
  @Output() change = new EventEmitter<string | null>();

  constructor(public layerManager: DataLayerManagerService) {}

  ngOnChanges(): void {
    this.change.emit(this.active);
  }

  onClick(tool: string | null) {
    if (this.active === tool) {
      this.active = null;
    } else {
      this.active = tool;
    }
    this.change.emit(this.active);
  }
}
