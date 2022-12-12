import { Component } from '@angular/core';
import { AnalysisCardContent } from 'ngx-charts-on-fhir';

@Component({
  templateUrl: './custom-card-example.component.html',
})
export class CustomCardExampleComponent extends AnalysisCardContent {
  override title = 'Example';
}
