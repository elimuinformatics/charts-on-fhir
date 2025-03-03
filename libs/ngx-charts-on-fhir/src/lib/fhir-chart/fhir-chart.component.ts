import { Component, Input, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import 'chartjs-adapter-date-fns';
import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';
import { merge } from 'lodash-es';
import { TimelineChartType, TimelineDataPoint } from '../data-layer/data-layer';
import { DataLayerManagerService } from '../data-layer/data-layer-manager.service';
import { FhirChartConfigurationService } from './fhir-chart-configuration.service';
import { scaleStackDividerPlugin } from './scale-stack-divider-plugin';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DragDropModule } from '@angular/cdk/drag-drop';

/**
 * See `*Chart` for example usage.
 */
@Component({
  imports: [CommonModule, NgChartsModule, MatProgressBarModule, DragDropModule],
  selector: 'fhir-chart',
  templateUrl: './fhir-chart.component.html',
  styleUrls: ['./fhir-chart.component.css'],
})
export class FhirChartComponent implements OnInit, OnDestroy {
  defaultType: ChartConfiguration['type'] = 'line';
  @Input() type: ChartConfiguration['type'] | null = this.defaultType;

  defaultDatasets: ChartConfiguration<TimelineChartType, TimelineDataPoint[]>['data']['datasets'] = [];
  @Input() datasets: ChartConfiguration<TimelineChartType, TimelineDataPoint[]>['data']['datasets'] | null = this.defaultDatasets;

  defaultOptions: ChartConfiguration['options'] = {};
  @Input() options: ChartConfiguration['options'] | null = this.defaultOptions;

  @Input() width: string = '600px';
  @Input() height: string = '300px';

  @Input() floatingContent?: TemplateRef<unknown>;

  @Input() emptyMessage: string = 'No data';

  constructor(
    public configService: FhirChartConfigurationService,
    public layerManager: DataLayerManagerService,
  ) {}

  ngOnInit(): void {
    Chart.register(scaleStackDividerPlugin, annotationPlugin, zoomPlugin);

    document.addEventListener('keydown', this.keyboardListener);

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
    Chart.defaults.plugins.tooltip.animation = false;
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

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.keyboardListener);
  }

  private readonly keyboardListener = (event: KeyboardEvent) => {
    if (this.isFormElementFocused()) {
      return;
    }
    const chart = this.configService.chart;
    if (chart) {
      switch (event.key) {
        case '+':
          this.configService.zoomIn();
          break;
        case '-':
          this.configService.zoomOut();
          break;
        case 'ArrowRight':
          chart.pan({ x: -50 });
          break;
        case 'ArrowLeft':
          chart.pan({ x: 50 });
          break;
      }
    }
  };

  isFormElementFocused(): boolean | null {
    const activeElement = document.activeElement;
    return (activeElement && ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(activeElement.tagName)) || activeElement?.closest('.mat-calendar') !== null;
  }
}
