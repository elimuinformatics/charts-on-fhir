import { Component, OnInit } from '@angular/core';
import { DataLayerManagerService } from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  selector: 'example-floating-content-demo',
  templateUrl: './floating-content-demo.component.html',
})
export class FloatingContentDemoComponent implements OnInit {
  constructor(private layerManager: DataLayerManagerService) {}
  ngOnInit(): void {
    this.layerManager.retrieveAll(true);
  }
}
