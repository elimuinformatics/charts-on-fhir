import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule],
  selector: 'data-layer-toolbar-loading-indicator',
  templateUrl: './data-layer-toolbar-loading-indicator.component.html',
  styleUrls: ['./data-layer-toolbar-loading-indicator.component.css'],
})
export class DataLayerToolbarLoadingIndicatorComponent {
  @Input() loading: boolean | null = null;
}
