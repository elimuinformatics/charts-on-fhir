import { Component, ContentChild, Input } from '@angular/core';
import { Dataset } from '../../data-layer/data-layer';
import { DataLayerColorService } from '../../data-layer/data-layer-color.service';
import { AnalysisCardContent } from '../analysis-card-content.component';

@Component({
  selector: 'analysis-card',
  templateUrl: './analysis-card.component.html',
  styleUrls: ['./analysis-card.component.css'],
})
export class AnalysisCardComponent {
  @Input() dataset?: Dataset;
  @Input() title?: string;
  @Input() icon?: string;

  @ContentChild(AnalysisCardContent) content?: AnalysisCardContent;

  constructor(private colorService: DataLayerColorService) {}

  get color() {
    if (this.dataset) {
      return this.colorService.getColor(this.dataset);
    }
    return '';
  }
}
