import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  DataLayerManagerService,
  FhirChartComponent,
  FhirChartLayoutComponent,
  FhirChartSummaryComponent,
  FhirChartTagsLegendComponent,
  PatientService,
  SummaryRangeSelectorComponent,
  TimelineRangeSelectorComponent,
  ToolbarButtonName,
} from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  imports: [
    CommonModule,
    SummaryRangeSelectorComponent,
    FhirChartLayoutComponent,
    FhirChartComponent,
    FhirChartSummaryComponent,
    FhirChartTagsLegendComponent,
    TimelineRangeSelectorComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [PatientService],
})
export class AppComponent implements OnInit {
  readonly toolbar: ToolbarButtonName[];
  active: ToolbarButtonName | null;

  constructor(
    readonly layerManager: DataLayerManagerService,
    readonly patientService: PatientService,
  ) {
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
