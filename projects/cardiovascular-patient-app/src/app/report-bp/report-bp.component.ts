import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FhirDataService } from 'ngx-charts-on-fhir';

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
export class ReportBPComponent implements OnInit {
  submitted = false;
  min = 11;
  max = 250;

  form = this.fb.group(
    {
      systolic: [null, [Validators.required, Validators.min(this.min), Validators.max(this.max)]],
      diastolic: [null, [Validators.required, Validators.min(this.min), Validators.max(this.max)]],
    },
    { validators: [BloodPressureRangeValidator] }
  );

  constructor(private fb: FormBuilder, private dataService: FhirDataService) { }

  ngOnInit(): void {
    this.form.valueChanges.subscribe((value) => {
      this.updateBPentryForm(value);
    });
  }

  onSubmit(): void {
    const bloodPressure = { systolic: this.form.value.systolic, diastolic: this.form.value.diastolic }
    const resource = this.dataService.createBloodPressureResource(bloodPressure);
    this.dataService.addPatientData(resource)
    this.submitted = true;
    this.form.reset();
  }

  private updateBPentryForm(formValue: typeof this.form.value): void {
    console.log(formValue);
  }
}
