import { Component, ElementRef, Inject, QueryList, ViewChildren } from '@angular/core';
import { DataLayer, ManagedDataLayer } from '../../data-layer/data-layer';
import { DataLayerColorService } from '../../data-layer/data-layer-color.service';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { FhirChartConfigurationService } from '../../fhir-chart/fhir-chart-configuration.service';
import { NumberRange } from '../../utils';
import { SummaryService } from '../summary.service';
import { combineLatest, map } from 'rxjs';
import { FhirChartLifecycleService } from '../../fhir-chart/fhir-chart-lifecycle.service';
import { mapValues } from 'lodash-es';
import { FhirChartSummaryCardComponent } from '../fhir-chart-summary-card/fhir-chart-summary-card.component';

/**
 * See `*ChartSummary` for example usage.
 */
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
    @Inject(SummaryService) private summaryServices: SummaryService[],
    private lifecycleService: FhirChartLifecycleService
  ) {}

  @ViewChildren('card', { read: ElementRef }) cards!: QueryList<ElementRef>;

  scalePositions$ = this.lifecycleService.afterUpdate$.pipe(map(([chart]) => mapValues(chart.scales, ({ top, bottom, height }) => ({ top, bottom, height }))));

  onCardClick(layer: ManagedDataLayer, index: number) {
    this.layerManager.focus(layer.id, this.cards.get(index)?.nativeElement.scrollHeight);
  }

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
