import { Component, OnInit } from '@angular/core';
import { DataLayerManagerService } from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  layers = [
    'Blood Pressure',
    'Heart rate',
    'Glucose',
    'Hemoglobin A1c/Hemoglobin.total in Blood',
    'O2 Sat',
    'Step Count',
    'Body Weight',
    'Prescribed Medications',
  ];
  views = {
    Hypertension: {
      selected: this.layers,
      enabled: ['Blood Pressure', 'Heart rate', 'Step Count', 'Body Weight', 'Prescribed Medications'],
    },
    Diabetes: {
      selected: this.layers,
      enabled: ['Glucose', 'Hemoglobin A1c/Hemoglobin.total in Blood', 'Step Count', 'Body Weight', 'Prescribed Medications'],
    },
  };

  constructor(readonly layerManager: DataLayerManagerService) {}

  ngOnInit(): void {
    this.layerManager.retrieveAll();
  }
}
