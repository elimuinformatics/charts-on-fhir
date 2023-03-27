import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FhirDataService } from '@elimuinformatics/ngx-charts-on-fhir';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

const BloodPressureRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const systolic = control.get('systolic');
  const diastolic = control.get('diastolic');

  return systolic && diastolic && systolic.value > diastolic.value ? null : { bloodPressure: true };
};

@Component({
  selector: 'report-bp',
  templateUrl: './report-bp.component.html',
  styleUrls: ['./report-bp.component.css'],
})
export class ReportBPComponent {
  submitted = false;
  min = 11;
  max = 250;

  @Output() resourceCreated = new EventEmitter<number>();

  form = this.fb.group(
    {
      systolic: [null, [Validators.required, Validators.min(this.min), Validators.max(this.max)]],
      diastolic: [null, [Validators.required, Validators.min(this.min), Validators.max(this.max)]],
    },
    { validators: [BloodPressureRangeValidator] }
  );

  constructor(private fb: FormBuilder, private dataService: FhirDataService, private snackBar: MatSnackBar) {}

  open(message: string, action = '', config?: MatSnackBarConfig) {
    return this.snackBar.open(message, action, config);
  }

  onSubmit(): void {
    const bloodPressure = { systolic: this.form.value.systolic, diastolic: this.form.value.diastolic };
    const resource = this.dataService.createBloodPressureResource(bloodPressure);
    if (resource) {
      this.dataService
        .addPatientData(resource)
        ?.then(() => {
          this.open('Blood Pressure Added Sucessfully', 'Dismiss', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 5000,
            panelClass: ['green-snackbar'],
          });
          this.resourceCreated.emit(1);
          this.submitted = true;
          this.form.reset();
        })
        .catch(() => {
          this.open('Something Wrong', 'Dismiss', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['red-snackbar'],
            duration: 5000,
          });
        });
    }
  }
}
