import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Chart } from 'chart.js';
import { DataLayer } from '../../data-layer/data-layer';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';


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
  monthDiff: number = 0;
  isFirst: boolean = true;

  rangeSelectorButtons = [
    { month: 1, value: '1 mo' },
    { month: 3, value: '3 mo' },
    { month: 6, value: '6 mo' },
    { month: 12, value: '1 y' },
  ]
  selectedButton: number = 0;

  constructor(private layerManager: DataLayerManagerService) {
    this.maxDate = new Date();
    this.minDate = new Date();
    

    this.layerManager.timelineRange$.subscribe((timelineRange) => {
      this.maxDate = new Date(timelineRange.max);
      this.minDate = new Date(timelineRange.min);
      const months = this.calculateMonthDiff(this.minDate, this.maxDate);
      this.isFirst ? this.selectedButton = 0 : this.selectedButton = months;
      this.isFirst = false;
    })
  }

  ngOnInit(): void {
    this.layerManager.selectedLayers$.subscribe((layers) => {
      this.layers = layers;
      this.getMaxDateFromLayers();
    })
  }

  updateRangeSelector(monthCount: number) {
    this.getMaxDateFromLayers()
    if (monthCount) {
      this.minDate = new Date(this.maxDate);
      this.minDate.setMonth(new Date(this.maxDate).getMonth() - monthCount);
      this.maxDate = new Date(this.maxDate);
      this.updateChart();
    } else {
      this.resetZoomChart()
    }
  }

  updateChart() {
    const chart = Chart.getChart('baseChart');
    chart?.zoomScale('timeline', { min: new Date(this.minDate).getTime(), max: new Date(this.maxDate).getTime() }, 'zoom');
    chart?.update();
  }

  resetZoomChart() {
    const chart = Chart.getChart('baseChart');
    chart?.resetZoom();
    chart?.update();
    this.getMaxDateFromLayers();
  }

  dateChange(event: MatDatepickerInputEvent<Date>, datePickerType: string) {
    if (event.value) {
      if (datePickerType === 'min') {
        this.minDate = event.value;
      } else {
        this.maxDate = event.value;
      }
    }
    this.updateChart();
  }

  getMaxDateFromLayers() {
    let data: any[] = [];
    if (this.layers) {
      this.layers.forEach((layersData) => {
        data.push(layersData.datasets[0].data)
      })
      let sortedData: any[] = [];
      for (let item of data) {
        let xcordinates = item.map((el: any) => el.x)
        sortedData = sortedData.concat(xcordinates)
      }
      sortedData = sortedData.sort((x: any, y: any) => {
        return x - y;
      })
      this.maxDate = new Date(sortedData[sortedData.length - 1]);
      this.minDate = new Date(sortedData[0])
    }
  }

  calculateMonthDiff(minDateValue: Date, maxDateValue: Date) {
    let months = (maxDateValue.getFullYear() - minDateValue.getFullYear()) * 12;
    months -= minDateValue.getMonth();
    months += maxDateValue.getMonth();
    months <= 0 ? 0 : months;
    return months;
  }

}
