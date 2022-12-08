import { Component, Input } from '@angular/core';

@Component({
  selector: 'data-layer-toolbar-button',
  templateUrl: './data-layer-toolbar-button.component.html',
  styleUrls: ['./data-layer-toolbar-button.component.css'],
})
export class DataLayerToolbarButtonComponent {
  @Input() icon: string = '';
  @Input() tooltip: string = '';
  @Input() active: boolean = false;
  @Input() badge: string | number | undefined | null = '';
}
