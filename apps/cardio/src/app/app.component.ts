import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  DataLayerManagerService,
  DataLayerSelectorComponent,
  FhirChartComponent,
  FhirChartLayoutComponent,
  FhirChartSummaryComponent,
  FhirChartTagsLegendComponent,
  SummaryRangeSelectorComponent,
  TimelineRangeSelectorComponent,
} from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  imports: [
    CommonModule,
    FhirChartComponent,
    FhirChartLayoutComponent,
    FhirChartSummaryComponent,
    TimelineRangeSelectorComponent,
    SummaryRangeSelectorComponent,
    DataLayerSelectorComponent,
    FhirChartTagsLegendComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  layers = ['Blood Pressure', 'Heart Rate', 'Glucose', 'Hemoglobin A1c', 'O2 Saturation', 'Step Count', 'Body Weight', 'Prescribed Medications'];
  views = {
    Cardiovascular: {
      selected: this.layers,
      enabled: ['Blood Pressure', 'Heart Rate', 'Step Count', 'Body Weight', 'Prescribed Medications'],
    },
    Diabetes: {
      selected: this.layers,
      enabled: ['Glucose', 'Hemoglobin A1c', 'Step Count', 'Body Weight', 'Prescribed Medications'],
    },
  };

  constructor(readonly layerManager: DataLayerManagerService) {}

  ngOnInit(): void {
    this.layerManager.retrieveAll();
  }
}
