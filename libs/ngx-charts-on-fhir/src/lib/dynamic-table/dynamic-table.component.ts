import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { zipObject } from 'lodash-es';

@Component({
  selector: 'dynamic-table',
  imports: [CommonModule],
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicTableComponent {
  columns: string[] = [];
  _data: Record<string, string>[] = [];
  /**
   * Input data can be an array of records or a 2D array.
   * If it is an array of records, the record keys will be the column headings.
   * If it is a 2D array, the first row will be column headings.
   * */
  @Input() set data(inputData: Record<string, string>[] | string[][]) {
    if (isArrayData(inputData)) {
      this._data = inputData.slice(1).map((row) => zipObject(inputData[0], row));
      this.columns = inputData[0];
    } else {
      this._data = inputData;
      this.columns = Object.keys(this._data[0]);
    }
  }
}

function isArrayData(data: Record<string, string>[] | string[][]): data is string[][] {
  return Array.isArray(data[0]);
}
