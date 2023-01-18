import { Component } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Chart } from 'chart.js';
import { DataLayer } from '../../data-layer/data-layer';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { FhirChartConfigurationService } from '../fhir-chart-configuration.service';

@Component({
  selector: 'range-selector',
  templateUrl: './range-selector.component.html',
  styleUrls: ['./range-selector.component.css'],
})
export class RangeSelectorComponent {
  layers?: DataLayer[];
  maxDate: Date | string;
  minDate: Date | string;
  isMatGroupFocus: boolean = true;

  constructor(private layerManager: DataLayerManagerService, private configService: FhirChartConfigurationService) {
    this.maxDate = new Date();
    this.minDate = new Date();
  }

  ngOnInit(): void {
    this.layerManager.selectedLayers$.subscribe((layers) => {
      this.layers = layers;
      this.getMaxDateFromLayers(layers);
    });
    this.configService.timelineRange$.subscribe((timelineRange) => {
      this.maxDate = new Date(timelineRange.max);
      this.minDate = new Date(timelineRange.min);
    });
  }
  updateRangeSelector(monthCount: number) {
    if (monthCount) {
      this.minDate = new Date(this.maxDate);
      this.minDate.setMonth(new Date(this.maxDate).getMonth() - monthCount);
      this.maxDate = new Date(this.maxDate);
    }
    let chart = Chart.getChart('baseChart');
    chart?.zoomScale('timeline', { min: new Date(this.minDate).getTime(), max: new Date(this.maxDate).getTime() }, 'zoom');
    chart?.update();
  }
  resetZoomData() {
    let chart = Chart.getChart('baseChart');
    chart?.resetZoom();
    chart?.update();
    this.getMaxDateFromLayers(this.layers);
  }

  dateChange(event: MatDatepickerInputEvent<Date>, datePickerType: string) {
    if (event.value) {
      if (datePickerType === 'min') {
        this.minDate = event.value;
      } else {
        this.maxDate = event.value;
      }
    }
    this.updateRangeSelector(0);
    this.isMatGroupFocus = false;
  }

  getMaxDateFromLayers(layers?: any[]) {
    let data: any[] = [];
    if (layers) {
      layers.forEach((layersData) => {
        data.push(layersData.datasets[0].data);
      });
      let sortedData: any[] = [];
      for (let item of data) {
        let xcordinates = item.map((el: any) => el.x);
        xcordinates = xcordinates.filter(function( element:any ) {
          return !Number.isNaN(element);
       });
        sortedData = sortedData.concat(xcordinates);
      }
      sortedData = sortedData.sort((x: any, y: any) => {
        return x - y;
      });
      this.maxDate = new Date(sortedData[sortedData.length - 1]);
      this.minDate = new Date(sortedData[0]);
    }
  }
}
