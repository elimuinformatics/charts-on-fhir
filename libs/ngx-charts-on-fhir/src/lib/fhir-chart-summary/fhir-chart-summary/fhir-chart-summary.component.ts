import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { combineLatest, map, shareReplay } from 'rxjs';
import { FhirChartLifecycleService } from '../../fhir-chart/fhir-chart-lifecycle.service';
import { mapValues } from 'lodash-es';

/**
 * See `*ChartSummary` for example usage.
 */
@Component({
  selector: 'fhir-chart-summary',
  templateUrl: './fhir-chart-summary.component.html',
  styleUrls: ['./fhir-chart-summary.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FhirChartSummaryComponent {
  constructor(public layerManager: DataLayerManagerService, private lifecycleService: FhirChartLifecycleService) {}

  scalePositions$ = this.lifecycleService.afterUpdate$.pipe(
    map(([chart]) => mapValues(chart.scales, ({ axis, top, bottom, height }) => ({ axis, top, bottom, height }))),
    shareReplay(1)
  );
  gridTemplateRows$ = combineLatest([this.layerManager.enabledLayers$, this.scalePositions$]).pipe(
    map(
      ([layers, scales]) =>
        layers
          .filter((layer) => layer.scale.id in scales)
          .map((layer) => (scales[layer.scale.id].height - 5).toFixed(0) + 'px')
          .join(' ') + ' auto'
    )
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
