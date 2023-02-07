import { Component, OnInit } from '@angular/core';
import { DataLayerManagerService, FhirDataService } from 'ngx-charts-on-fhir';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(readonly layerManager: DataLayerManagerService, readonly fhir: FhirDataService) {}
  ngOnInit(): void {
    if (this.fhir.client?.patient.id) {
      this.layerManager.retrieveAll();
    } else {
      console.warn('No Patient');
    }
  }
}
