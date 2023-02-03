import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';

export type ToolbarButtonName = 'loading' | 'browser' | 'options';

@Component({
  selector: 'data-layer-toolbar',
  templateUrl: './data-layer-toolbar.component.html',
  styleUrls: ['./data-layer-toolbar.component.css'],
})
export class DataLayerToolbarComponent implements OnChanges {
  @Input() active: ToolbarButtonName | null = null;
  @Output() activeChange = new EventEmitter<ToolbarButtonName | null>();

  @Input() buttons?: ToolbarButtonName[] | 'all' = 'all';

  constructor(public layerManager: DataLayerManagerService) {}

  ngOnChanges(): void {
    this.activeChange.emit(this.active);
  }

  onClick(tool: ToolbarButtonName | null) {
    if (this.active === tool) {
      this.active = null;
    } else {
      this.active = tool;
    }
    this.activeChange.emit(this.active);
  }

  showButton(name: ToolbarButtonName): boolean {
    return !!(this.buttons === 'all' || this.buttons?.includes(name));
  }
}
