import { Component, Input } from '@angular/core';
import { ScatterDataPoint } from 'chart.js';
import { DataLayer, Dataset } from '../data-layer/data-layer';

@Component({ template: '' })
export abstract class AnalysisCardContent {
  title = '';
  icon = 'info';
  @Input() layer?: DataLayer;
  @Input() dataset?: Dataset;
  @Input() visibleData: ScatterDataPoint[] = [];
  @Input() dateRange?: DateRange;
  /** Cards will be sorted in descending priority order. Cards with priority <= 0 will be hidden. */
  get priority(): number {
    return 1;
  }
}

export type DateRange = {
  min: Date;
  max: Date;
  days: number;
};
