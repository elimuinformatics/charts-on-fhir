import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { PatientService } from './patient.service';

type PatientRow = {
  id: string;
  name: string;
};

/**
 * See `*PatientBrowser` for example usage.
 */
@Component({
  selector: 'patient-browser',
  templateUrl: './patient-browser.component.html',
  styleUrls: ['./patient-browser.component.css'],
})
export class PatientBrowserComponent {
  dataSource = new MatTableDataSource<PatientRow>();
  displayedColumns = ['select', 'id', 'name'];
  filterControl = new FormControl('', { nonNullable: true });
  selectedPatient?: string;

  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatTable) table?: MatTable<PatientRow>;

  constructor(public patientService: PatientService) {}

  getId = (_index: number, row: PatientRow) => row.id;
  isSelected = (row: PatientRow) => row.id === this.selectedPatient;

  ngOnInit(): void {
    this.patientService.patients$.subscribe((patients) => (this.dataSource.data = patients));
    this.patientService.selectedPatient$.subscribe((selected) => (this.selectedPatient = selected));
    this.filterControl.valueChanges.subscribe((filter) => (this.dataSource.filter = filter));
  }

  ngAfterViewInit() {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
}
