import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';

@Component({
  selector: 'data-layer-toolbar',
  templateUrl: './data-layer-toolbar.component.html',
  styleUrls: ['./data-layer-toolbar.component.css'],
})
export class DataLayerToolbarComponent implements OnChanges {
  @Input() active: string | null = null;
  @Output() activeChange = new EventEmitter<string | null>();

  @Input() showAddDataLayer? = true;

  constructor(public layerManager: DataLayerManagerService) {}

  ngOnChanges(): void {
    this.activeChange.emit(this.active);
  }

  onClick(tool: string | null) {
    if (this.active === tool) {
      this.active = null;
    } else {
      this.active = tool;
    }
    this.activeChange.emit(this.active);
  }
}
