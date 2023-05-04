import { Component, OnInit } from '@angular/core';
import { DataLayerManagerService } from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  selector: 'example-summary-range-selector-demo',
  templateUrl: './summary-range-selector-demo.component.html',
  styleUrls: ['./summary-range-selector-demo.css'],
})
export class SummaryRangeSelectorDemoComponent implements OnInit {
  constructor(private layerManager: DataLayerManagerService) {}
  ngOnInit(): void {
    this.layerManager.autoSelect(true);
    this.layerManager.retrieveAll();
  }
}
