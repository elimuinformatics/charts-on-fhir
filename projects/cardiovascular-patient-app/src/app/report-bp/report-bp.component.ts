import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DataLayerManagerService } from 'ngx-charts-on-fhir';

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
export class ReportbpComponent implements OnInit {
  submitted = false;
  min = 11;
  max = 250;

  form = this.fb.group(
    {
      systolic: [null, [Validators.required, Validators.min(this.min), Validators.max(this.max)]],
      diastolic: [null, [Validators.required, Validators.min(this.min), Validators.max(this.max)]],
    },
    { validator: [BloodPressureRangeValidator] }
  );

  constructor(private fb: FormBuilder, private layerManager: DataLayerManagerService) {}

  ngOnInit(): void {
    this.form.valueChanges.subscribe((value) => {
      console.log(this.layerManager.availableLayers$);
      this.updateBPentryForm(value);
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.form.reset();
  }

  private updateBPentryForm(formValue: typeof this.form.value): void {
    console.log(formValue);
  }
}
