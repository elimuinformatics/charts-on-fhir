import { Component } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Chart } from 'chart.js';
import { DataLayer } from '../../data-layer/data-layer';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { FhirChartConfigurationService } from '../fhir-chart-configuration.service';

interface LayerRange {
  min: Date,
  max: Date
}

@Component({
  selector: 'range-selector',
  templateUrl: './range-selector.component.html',
  styleUrls: ['./range-selector.component.css'],
})
export class RangeSelectorComponent {
  layers?: DataLayer[];
  maxDate: Date;
  minDate: Date;
  layerRange: LayerRange = { min: new Date(), max: new Date() }


  rangeSelectorButtons = [
    { month: 1, value: '1 mo' },
    { month: 3, value: '3 mo' },
    { month: 6, value: '6 mo' },
    { month: 12, value: '1 y' },
  ]
  selectedButton: number | boolean = true;

  constructor(private layerManager: DataLayerManagerService, private configService: FhirChartConfigurationService) {
    this.maxDate = new Date();
    this.minDate = new Date();
    this.configService.timelineRange$.subscribe((timelineRange) => {
      this.maxDate = new Date(timelineRange.max);
      this.minDate = new Date(timelineRange.min);
      const months = this.calculateMonthDiff(this.minDate, this.maxDate);
      if (this.layerRange.max <= this.maxDate && this.layerRange.min >= this.minDate) {
        this.selectedButton = true;
      } else {
        this.selectedButton = months;
      }
    })
  }

  ngOnInit(): void {
    this.layerManager.selectedLayers$.subscribe((layers) => {
      this.layers = layers;
      this.layerRange = this.getLayerRangeFromLayers();
    })
  }

  updateRangeSelector(monthCount: number) {
    if (monthCount) {
      this.minDate = new Date(this.maxDate);
      this.minDate.setMonth(new Date(this.maxDate).getMonth() - monthCount);
      this.maxDate = new Date(this.maxDate);
    }
    let chart = Chart.getChart('baseChart');
    const range = { min: new Date(this.minDate).getTime(), max: new Date(this.maxDate).getTime() };
    this.configService.setTimelineRange(range);
    chart?.zoomScale('timeline', range, 'zoom');
    chart?.update();
  }
  resetZoomChart() {
    let chart = Chart.getChart('baseChart');
    this.configService.resetTimelineRange();
    chart?.resetZoom();
    chart?.update();
  }

  dateChange(event: MatDatepickerInputEvent<Date>, datePickerType: string) {
    if (event.value) {
      if (datePickerType === 'min') {
        this.minDate = event.value;
      } else {
        this.maxDate = event.value;
      }
    }
  }

  getLayerRangeFromLayers(): LayerRange {
    let data: any[] = [];
    if (this.layers) {
      data = this.layers.map((layersData) => layersData.datasets[0].data);
      let sortedData: any[] = [];
      for (let item of data) {
        const xcordinates = item.map((el: any) => el.x)
        sortedData = sortedData.concat(xcordinates)
      }
      sortedData = sortedData.sort((x: any, y: any) => x - y)
      return { min: new Date(sortedData[0]), max: new Date(sortedData[sortedData.length - 1]) }
    }
    return { min: new Date(), max: new Date() }
  }

  calculateMonthDiff(minDateValue: Date, maxDateValue: Date): number {
    let months = (maxDateValue.getFullYear() - minDateValue.getFullYear()) * 12;
    months -= minDateValue.getMonth();
    months += maxDateValue.getMonth();
    if (months) {
      return months;
    }
    return 0;
  }

}