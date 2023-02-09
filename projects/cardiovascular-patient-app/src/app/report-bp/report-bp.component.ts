import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DataLayerManagerService } from 'ngx-charts-on-fhir';
import { formatDate, formatTime } from 'ngx-charts-on-fhir';
import { map } from 'rxjs';

const BloodPressureRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const systolic = control.get('systolic');
  const diastolic = control.get('diastolic');

  return systolic && diastolic && systolic.value > diastolic.value ? null : { bloodPressure: true };
};

interface LastReportedBPdata {
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
  lastReportedBPdata?: LastReportedBPdata;
  isLastPriorBp: boolean = true;

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
      this.updateBPentryForm(value);
    });
    this.layerManager.allLayers$
      .pipe(
        map((layers) =>
          layers
            .filter((layer) => layer.name === 'Blood Pressure')
            .map((layer) => layer.datasets.map((data) => data.data))
            .map((layer) => layer.map((data) => data.slice(-1)))
        )
      )
      .subscribe((layers: any) => {
        if (layers.length > 0) {
          this.isLastPriorBp = true;
          this.lastReportedBPdata = {
            systolic: { date: `${formatDate(layers[0][1][0].x)} at ${formatTime(layers[0][1][0].x)}`, value: layers[0][1][0].y },
            diastolic: { date: `${formatDate(layers[0][0][0].x)} at ${formatTime(layers[0][0][0].x)}`, value: layers[0][0][0].y },
          };
        } else {
          this.isLastPriorBp = false;
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
