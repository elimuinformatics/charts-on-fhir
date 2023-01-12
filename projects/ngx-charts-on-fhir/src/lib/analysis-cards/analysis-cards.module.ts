import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsComponent } from './statistics/statistics.component';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AnalysisCardComponent } from './analysis-card/analysis-card.component';

@NgModule({
  declarations: [AnalysisCardComponent, StatisticsComponent],
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule],
  exports: [AnalysisCardComponent, StatisticsComponent],
})
export class AnalysisCardsModule {}
