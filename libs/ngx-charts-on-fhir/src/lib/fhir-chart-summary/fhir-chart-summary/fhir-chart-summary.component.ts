import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { combineLatest, map, shareReplay } from 'rxjs';
import { FhirChartLifecycleService } from '../../fhir-chart/fhir-chart-lifecycle.service';
import { mapValues } from 'lodash-es';
import { FhirChartConfigurationService } from '../../fhir-chart/fhir-chart-configuration.service';
import { CommonModule } from '@angular/common';
import { FhirChartSummaryCardComponent } from '../fhir-chart-summary-card/fhir-chart-summary-card.component';

/**
 * See `*ChartSummary` for example usage.
 */
@Component({
  imports: [CommonModule, FhirChartSummaryCardComponent],
  selector: 'fhir-chart-summary',
  templateUrl: './fhir-chart-summary.component.html',
  styleUrls: ['./fhir-chart-summary.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FhirChartSummaryComponent {
  constructor(
    public layerManager: DataLayerManagerService,
    private readonly lifecycleService: FhirChartLifecycleService,
    private readonly configService: FhirChartConfigurationService,
  ) {}

  /** When set to `true`, each card will be vertically aligned with the corresponding chart. */
  @Input() autoAlign = false;

  ngOnInit() {
    this.configService.setSummaryRange(1);
  }

  scalePositions$ = this.lifecycleService.afterUpdate$.pipe(
    map(([chart]) => mapValues(chart.scales, ({ axis, top, bottom, height }) => ({ axis, top, bottom, height }))),
    shareReplay(1),
  );
  gridTemplateRows$ = combineLatest([this.layerManager.enabledLayers$, this.scalePositions$]).pipe(
    map(
      ([layers, scales]) =>
        layers
          .filter((layer) => layer.scale.id in scales)
          .map((layer) => (scales[layer.scale.id].height - 5).toFixed(0) + 'px')
          .join(' ') + ' auto',
    ),
  );

  expandedCard: string | null = null;
  onCardExpand(layerId: string) {
    this.expandedCard = layerId;
  }
  onCardCollapse(layerId: string) {
    if (this.expandedCard === layerId) {
      this.expandedCard = null;
    }
  }
}
