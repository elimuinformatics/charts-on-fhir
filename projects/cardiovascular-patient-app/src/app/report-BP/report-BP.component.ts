import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'report-BP',
  templateUrl: './report-BP.component.html',
  styleUrls: ['./report-BP.component.css'],
})
export class ReportBPComponent implements OnInit {
  submitted = false;

  form: FormGroup = this.fb.group({
    systolic: ['', [Validators.required, Validators.min(11), Validators.max(250)]],
    diastolic: ['', [Validators.required, Validators.min(11), Validators.max(250)]],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.valueChanges.subscribe((value) => {
      this.updateBPentryForm(value);
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.form.reset();
  }

  private updateBPentryForm(formValue: typeof this.form.value): void {
    console.log(this.form);
  }
  get field(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
