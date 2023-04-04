import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { PatientService } from '../../patient-browser/patient.service';

export type ToolbarButtonName = 'loading' | 'patients' | 'browser' | 'options';

@Component({
  selector: 'data-layer-toolbar',
  templateUrl: './data-layer-toolbar.component.html',
  styleUrls: ['./data-layer-toolbar.component.css'],
})
export class DataLayerToolbarComponent implements OnChanges {
  @Input() active: ToolbarButtonName | null = null;
  @Output() activeChange = new EventEmitter<ToolbarButtonName | null>();

  @Input() buttons?: ToolbarButtonName[];

  constructor(public layerManager: DataLayerManagerService, public patientService: PatientService) {}

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
    return !!(this.buttons == null || this.buttons?.includes(name));
  }
}
