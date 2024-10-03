import { Component, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PatientService } from './patient.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule, MatIconButton } from '@angular/material/button';

type PatientRow = {
  id: string;
  name: string;
};

/**
 * See `*PatientBrowser` for example usage.
 */
@Component({
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTableModule, MatSortModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
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
