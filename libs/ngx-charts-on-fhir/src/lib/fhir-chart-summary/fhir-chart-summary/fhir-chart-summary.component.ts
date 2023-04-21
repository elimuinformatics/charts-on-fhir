import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { map } from 'rxjs';
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
    map(([chart]) => mapValues(chart.scales, ({ axis, top, bottom, height }) => ({ axis, top, bottom, height })))
  );
  gridTemplateRows$ = this.scalePositions$.pipe(
    map(
      (scales) =>
        Object.values(scales)
          .filter((scale) => scale.axis === 'y')
          .map((scale) => (scale.height - 5).toFixed(0) + 'px')
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
