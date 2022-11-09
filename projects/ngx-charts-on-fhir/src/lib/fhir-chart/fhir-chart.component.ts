import { Component, Input, OnInit } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import 'chartjs-adapter-date-fns';
import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';
import { merge } from 'lodash-es';
import { FhirChartConfigurationService } from './fhir-chart-configuration.service';

@Component({
  selector: 'fhir-chart',
  templateUrl: './fhir-chart.component.html',
  styleUrls: ['./fhir-chart.component.css'],
  providers: [FhirChartConfigurationService],
})
export class FhirChartComponent implements OnInit {
  defaultType: ChartConfiguration['type'] = 'line';
  @Input() type: ChartConfiguration['type'] | null = this.defaultType;

  defaultDatasets: ChartConfiguration['data']['datasets'] = [];
  @Input() datasets: ChartConfiguration['data']['datasets'] | null = this.defaultDatasets;

  defaultOptions: ChartConfiguration['options'] = {};
  @Input() options: ChartConfiguration['options'] | null = this.defaultOptions;

  constructor(private configService: FhirChartConfigurationService) {}

  ngOnInit(): void {
    Chart.register(annotationPlugin, zoomPlugin);

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

    // disable some distracting animations
    Chart.defaults.plugins.tooltip.animation.duration = 0;
    Chart.defaults.plugins.annotation.animations = {
      numbers: {
        properties: [],
      },
    };

    this.configService.chartConfig$.subscribe((config) => {
      this.datasets = config.data.datasets;
      this.options = config.options;
    });
  }
}
