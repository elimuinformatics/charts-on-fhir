import { Component, Inject } from '@angular/core';
import { DataLayer } from '../../data-layer/data-layer';
import { DataLayerColorService } from '../../data-layer/data-layer-color.service';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { FhirChartConfigurationService } from '../../fhir-chart/fhir-chart-configuration.service';
import { NumberRange } from '../../utils';
import { SummaryService } from '../summary.service';

@Component({
  selector: 'fhir-chart-summary',
  templateUrl: './fhir-chart-summary.component.html',
  styleUrls: ['./fhir-chart-summary.component.css'],
})
export class FhirChartSummaryComponent {
  constructor(
    public layerManager: DataLayerManagerService,
    public configService: FhirChartConfigurationService,
    public colorService: DataLayerColorService,
    @Inject(SummaryService) private summaryServices: SummaryService[]
  ) {}

  summarize(layer: DataLayer, range: NumberRange | null) {
    if (range) {
      for (let summaryService of this.summaryServices) {
        if (summaryService.canSummarize(layer)) {
          return summaryService.summarize(layer, range);
        }
      }
    }
    return [{}];
  }
}
