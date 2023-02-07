import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DataLayerManagerService } from 'ngx-charts-on-fhir';
import moment from 'moment';

const BloodPressureRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const systolic = control.get('systolic');
  const diastolic = control.get('diastolic');

  return systolic && diastolic && systolic.value > diastolic.value ? null : { bloodPressure: true };
};

interface lastReportedBPdata {
  systolic: { date: string; value: number };
  diastolic: { date: string; value: number };
}

@Component({
  selector: 'report-bp',
  templateUrl: './report-bp.component.html',
  styleUrls: ['./report-bp.component.css'],
})
export class ReportBPComponent implements OnInit {
  submitted = false;
  min = 11;
  max = 250;
  lastReportedBPdata?: lastReportedBPdata;

  form = this.fb.group(
    {
      systolic: [null, [Validators.required, Validators.min(this.min), Validators.max(this.max)]],
      diastolic: [null, [Validators.required, Validators.min(this.min), Validators.max(this.max)]],
    },
    { validators: [BloodPressureRangeValidator] }
  );

  constructor(private fb: FormBuilder, private layerManager: DataLayerManagerService) {}

  ngOnInit(): void {
    this.form.valueChanges.subscribe((value) => {
      console.log(this.layerManager.availableLayers$);
      this.updateBPentryForm(value);
    });
    this.layerManager.lastBPLayers$.subscribe((data: any) => {
      if (data.length > 0) {
        this.lastReportedBPdata = {
          systolic: { date: `${moment(data[0][1][0].x).format('D MMM YYYY')} at ${moment(data[0][1][0].x).format('hh:MM A')}`, value: data[0][1][0].y },
          diastolic: { date: `${moment(data[0][0][0].x).format('D MMM YYYY')} at ${moment(data[0][0][0].x).format('hh:MM A')}`, value: data[0][0][0].y },
        };
      }
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
