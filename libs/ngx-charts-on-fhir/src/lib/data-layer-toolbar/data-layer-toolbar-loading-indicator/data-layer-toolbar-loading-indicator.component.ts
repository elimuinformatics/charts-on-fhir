import { Component, Input } from '@angular/core';

@Component({
  selector: 'data-layer-toolbar-loading-indicator',
  templateUrl: './data-layer-toolbar-loading-indicator.component.html',
  styleUrls: ['./data-layer-toolbar-loading-indicator.component.css'],
})
export class DataLayerToolbarLoadingIndicatorComponent {
  @Input() loading: boolean | null = null;
}
