import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  DataLayerManagerService,
  PatientBrowserComponent,
} from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  selector: 'example-patient-browser-demo',
  templateUrl: './patient-browser-demo.component.html',
  standalone: true,
  imports: [CommonModule, PatientBrowserComponent],
})
export class PatientBrowserDemoComponent implements OnInit {
  constructor(private layerManager: DataLayerManagerService) {}
  ngOnInit(): void {
    this.layerManager.retrieveAll();
  }
}
