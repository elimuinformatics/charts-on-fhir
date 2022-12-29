import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';


@Component({
  selector: 'range-selector',
  templateUrl: './range-selector.component.html',
  styleUrls: ['./range-selector.component.css'],
})
export class RangeSelectorComponent {

  showBtns: boolean = true;
  layerData: any;
  array: any = [];
  finalArray: any = [];
  maxDate: any
  minDate: any
  constructor(private layerManager: DataLayerManagerService) { }

  ngOnInit(): void {
    this.layerManager.selectedLayers$.subscribe((layers) => {
      this.getMaxDateFromLayers(layers); 
      if (layers.length > 0) {
        this.showBtns = true;
      } else {
        this.showBtns = false;
      }
    })

  }
  updateRangeSelector(monthCount: number) {
    if(monthCount) {
      this.minDate = new Date(this.maxDate);
      this.minDate.setMonth(this.minDate.getMonth() - monthCount); 
    } 
    let chart = Chart.getChart('baseChart');
    chart?.zoomScale('timeline', { min: new Date(this.minDate).getTime(), max: new Date(this.maxDate).getTime() }, 'zoom')
    chart?.update() 
  }
  resetZoomData() {
    let chart = Chart.getChart('baseChart');
    chart?.resetZoom();
    chart?.update();
  }

  dateChange(date: any, type: string) {
    type === 'min' ? this.minDate = date.value : this.maxDate = date.value;
    this.updateRangeSelector(0);
  }

  getMaxDateFromLayers(layers: any[]) {
    let data: any[] = [];
    layers.forEach((layersData) => {
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
    this.maxDate = sortedData[sortedData.length - 1];
    this.minDate = sortedData[0] 
  }
}
