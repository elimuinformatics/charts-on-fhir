import { Component, Input } from '@angular/core';
import { Dataset } from '../../data-layer/data-layer';
import { DataLayerColorService } from '../../data-layer/data-layer-color.service';

@Component({
  selector: 'analysis-card',
  templateUrl: './analysis-card.component.html',
  styleUrls: ['./analysis-card.component.css'],
})
export class AnalysisCardComponent {
  @Input() dataset?: Dataset;
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() icon?: string;

  constructor(private colorService: DataLayerColorService) {}

  get color() {
    if (this.dataset) {
      return this.colorService.getColor(this.dataset);
    }
    return '';
  }
}
