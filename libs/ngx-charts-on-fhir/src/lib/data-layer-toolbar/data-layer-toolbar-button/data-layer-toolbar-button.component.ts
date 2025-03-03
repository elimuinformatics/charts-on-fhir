import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule, MatBadgeModule],
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
