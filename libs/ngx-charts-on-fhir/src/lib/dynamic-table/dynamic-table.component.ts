import { Component, Input } from '@angular/core';
import { zipObject } from 'lodash-es';

@Component({
  selector: 'dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css'],
})
export class DynamicTableComponent {
  columns: string[] = [];
  _data: Record<string, string>[] = [];
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
