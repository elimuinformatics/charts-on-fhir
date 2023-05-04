import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineRangeSelectorDemoComponent } from './demo/timeline-range-selector-demo.component';
import {
  DataLayerManagerService,
  FhirChartConfigurationService,
  FhirChartModule,
  TimelineRangeSelectorModule,
} from '@elimuinformatics/ngx-charts-on-fhir';

@NgModule({
  declarations: [TimelineRangeSelectorDemoComponent],
  imports: [CommonModule, FhirChartModule, TimelineRangeSelectorModule],
  providers: [DataLayerManagerService, FhirChartConfigurationService],
})
export class TimelineRangeSelectorDemoModule {}
