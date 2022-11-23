import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsComponent } from './statistics/statistics.component';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReferenceRangeComponent } from './reference-range/reference-range.component';

@NgModule({
  declarations: [StatisticsComponent, ReferenceRangeComponent],
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule],
  exports: [StatisticsComponent, ReferenceRangeComponent],
})
export class AnalysisCardsModule {}
