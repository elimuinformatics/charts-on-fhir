import { Component, OnInit } from '@angular/core';
import { DataLayerManagerService, PatientService, ToolbarButtonName } from 'ngx-charts-on-fhir';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  readonly toolbar: ToolbarButtonName[];
  active: ToolbarButtonName | null;

  constructor(readonly layerManager: DataLayerManagerService, readonly patientService: PatientService) {
    if (patientService.isSinglePatientContext) {
      this.toolbar = ['loading', 'browser', 'options'];
      this.active = 'browser';
    } else {
      this.toolbar = ['loading', 'patients', 'browser', 'options'];
      this.active = 'patients';
    }
  }

  ngOnInit(): void {
    this.patientService.selectedPatient$.subscribe(() => {
      this.layerManager.retrieveAll();
    });
  }
}
