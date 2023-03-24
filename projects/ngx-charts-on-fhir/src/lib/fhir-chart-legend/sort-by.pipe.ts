import { Pipe, PipeTransform } from '@angular/core';
import { Dataset } from '../data-layer/data-layer';
import { byMostRecentValue } from '../fhir-chart-summary/statistics.service';

@Pipe({ name: 'sortBy' })
export class SortByPipe implements PipeTransform {
    transform(value: Dataset[]): Dataset[] {
        if (!value || value.length <= 1) {
            return value;
        }
        return value.slice().sort(byMostRecentValue);
    }
}