import { Component, Input, OnInit } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import 'chartjs-adapter-date-fns';
import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';
import { merge } from 'lodash-es';
import { TimelineChartType, TimelineDataPoint } from '../data-layer/data-layer';
import { DataLayerManagerService } from '../data-layer/data-layer-manager.service';
import { FhirChartConfigurationService } from './fhir-chart-configuration.service';
import { MedicationScale } from './medication-scale';
import { scaleStackDividerPlugin } from './scale-stack-divider-plugin';

export type LegendPosition = 'none' | 'float' | 'top' | 'bottom';

/**
 * See `*Chart` for example usage.
 */
@Component({
  selector: 'fhir-chart',
  templateUrl: './fhir-chart.component.html',
  styleUrls: ['./fhir-chart.component.css'],
})
export class FhirChartComponent implements OnInit {
  defaultType: ChartConfiguration['type'] = 'line';
  @Input() type: ChartConfiguration['type'] | null = this.defaultType;

  defaultDatasets: ChartConfiguration<TimelineChartType, TimelineDataPoint[]>['data']['datasets'] = [];
  @Input() datasets: ChartConfiguration<TimelineChartType, TimelineDataPoint[]>['data']['datasets'] | null = this.defaultDatasets;

  defaultOptions: ChartConfiguration['options'] = {};
  @Input() options: ChartConfiguration['options'] | null = this.defaultOptions;

  @Input() width: string = '600px';
  @Input() height: string = '300px';

  @Input() legendPosition: LegendPosition = 'float';
  readonly gridRow = { top: 1, bottom: 3 } as const;

  constructor(private configService: FhirChartConfigurationService, public layerManager: DataLayerManagerService) {}

  ngOnInit(): void {
    Chart.register(annotationPlugin, zoomPlugin, scaleStackDividerPlugin);
    Chart.register(MedicationScale);

    // To responsively resize the chart based on its container size, we must set maintainAspectRatio = false
    Chart.defaults.maintainAspectRatio = false;

    Chart.defaults.plugins.zoom = merge(Chart.defaults.plugins.zoom, {
      pan: {
        enabled: true,
        mode: 'x',
      },
      zoom: {
        mode: 'x',
        wheel: { enabled: true },
        drag: { enabled: false },
        pinch: { enabled: true },
      },
    });

    Chart.defaults.elements.point.radius = 5;

    // prevents the tick labels of stacked charts from overlapping
    Chart.defaults.scales.linear.offset = true;

    // don't display min/max as extra ticks
    Chart.defaults.scales.linear.ticks.includeBounds = false;

    // disable some distracting animations
    Chart.defaults.plugins.tooltip.animation.duration = 0;
    Chart.defaults.plugins.annotation.animations = {
      numbers: {
        properties: [],
      },
    };

    // we use a custom legend component instead
    Chart.defaults.plugins.legend.display = false;

    this.configService.chartConfig$.subscribe((config) => {
      this.datasets = config.data.datasets;
      this.options = config.options;
    });
  }

  ngAfterViewChecked() {
    this.configService.chart = Chart.getChart('baseChart');
  }
}
