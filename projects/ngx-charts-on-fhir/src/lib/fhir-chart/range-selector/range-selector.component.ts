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
  maximumDate: any
  constructor(private layerManager: DataLayerManagerService) { }

  ngOnInit(): void {
    this.layerManager.selectedLayers$.subscribe((layers) => {
      this.array = [];
      console.log(layers)
      layers.forEach((layersData) => {
        this.array.push(layersData.datasets[0].data)
      })
      this.finalArray = [];
      for (let item of this.array) {
        let xcordinates = item.map((el: any) => el.x)
        this.finalArray = this.finalArray.concat(xcordinates)
      }
      this.finalArray = this.finalArray.sort((x: any, y: any) => {
        return x - y;
      })
      this.maxDate = this.finalArray[this.finalArray.length - 1]

      if (layers.length > 0) {
        this.showBtns = true;
      } else {
        this.showBtns = false;
      }
    })

  }
  getMonthData(monthCount: any) {
    var newDate = new Date(this.maxDate);
    newDate.setMonth(newDate.getMonth() - monthCount);
    let chart = Chart.getChart('baseChart');
    chart?.zoomScale('timeline', { min: new Date(newDate).getTime(), max: new Date(this.maxDate).getTime() }, 'zoom')
    chart?.update()
  }
  getGraphselectedDateData(maxDate: any, minDate: any) {
    if (maxDate !== null && minDate !== null) {
      let chart = Chart.getChart('baseChart');
      chart?.zoomScale('timeline', { min: new Date(minDate).getTime(), max: new Date(maxDate).getTime() }, 'zoom')
      chart?.update()
    }
  }
  resetZoomData() {
    let chart = Chart.getChart('baseChart');
    chart?.resetZoom();
    chart?.update();
  }
  minDateFunction(date: any) {
    this.minDate = date.value;
    this.getGraphselectedDateData(this.maximumDate, this.minDate)
  }
  maxDateFunction(date: any) {
    this.maximumDate = date.value;
    this.getGraphselectedDateData(this.maximumDate, this.minDate)
  }
}
