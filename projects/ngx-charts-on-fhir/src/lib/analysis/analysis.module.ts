import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisComponent } from './analysis.component';
import { MatCardModule } from '@angular/material/card';
import { AnalysisCardHostDirective } from './analysis-card-host.directive';
import { AnalysisCardComponent } from './analysis-card/analysis-card.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [AnalysisComponent, AnalysisCardHostDirective, AnalysisCardComponent],
  imports: [CommonModule, MatCardModule, MatIconModule],
  exports: [AnalysisComponent],
})
export class AnalysisModule {}
