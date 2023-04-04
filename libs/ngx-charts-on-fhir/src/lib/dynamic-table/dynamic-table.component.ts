import { Component, Input } from '@angular/core';

@Component({
  selector: 'dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css'],
})
export class DynamicTableComponent {
  @Input() data: Record<string, string>[] = [{}];
  get columns() {
    return Object.keys(this.data[0]);
  }
}
