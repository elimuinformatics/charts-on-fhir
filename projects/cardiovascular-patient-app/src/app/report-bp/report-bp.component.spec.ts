import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ReportBPComponent } from './report-bp.component';
import { MatInputHarness } from '@angular/material/input/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FhirDataService } from '@elimuinformatics/ngx-charts-on-fhir';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

const fhirResource = {
  resourceType: 'Observation',
  component: [
    {
      valueQuantity: {
        value: 100,
      },
    },
    {
      valueQuantity: {
        value: 50,
      },
    },
  ],
};

describe('ReportBPComponent', () => {
  let component: ReportBPComponent;
  let fixture: ComponentFixture<ReportBPComponent>;
  let loader: HarnessLoader;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let fhirDataServiceSpy: jasmine.SpyObj<FhirDataService>;

  beforeEach(async () => {
    matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    fhirDataServiceSpy = jasmine.createSpyObj('FhirDataService', ['createBloodPressureResource', 'addPatientData']);
    fhirDataServiceSpy.createBloodPressureResource.and.returnValue(fhirResource);
    fhirDataServiceSpy.addPatientData.and.returnValue(of(fhirResource));
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NoopAnimationsModule, MatInputModule, MatFormFieldModule, MatCardModule],
      declarations: [ReportBPComponent],
      providers: [FormBuilder, { provide: MatSnackBar, useValue: matSnackBarSpy }, { provide: FhirDataService, useValue: fhirDataServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportBPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind the systolic to its form control and for valid value there should be no error', async () => {
    const systolicInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='systolic']" }));
    await systolicInputHarness.setValue('11');
    const systolicFormField: any = component.form.get('systolic');
    const value = await systolicInputHarness.getValue();
    expect(systolicFormField?.value).toEqual(parseInt(value));
    expect(systolicFormField?.errors).toBeNull();
  });

  it('should bind the systolic to its form control and for invalid value there should be error', async () => {
    const systolicInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='systolic']" }));
    await systolicInputHarness.setValue('');
    const systolicFormField = component.form.get('systolic');
    expect(systolicFormField?.errors).not.toBeNull();
    expect(systolicFormField?.errors?.['required']).toBeTruthy();
  });

  it('should bind the diastolic to its form control and for valid value there should be no error', async () => {
    const diastolicInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='diastolic']" }));
    await diastolicInputHarness.setValue('11');
    const diastolicFormField: any = component.form.get('diastolic');
    const value = await diastolicInputHarness.getValue();
    expect(diastolicFormField?.value).toEqual(parseInt(value));
    expect(diastolicFormField?.errors).toBeNull();
  });

  it('should bind the diastolic to its form control and for invalid value there should be error', async () => {
    const diastolicInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='diastolic']" }));
    await diastolicInputHarness.setValue('');
    const diastolicFormField = component.form.get('diastolic');
    expect(diastolicFormField?.errors).not.toBeNull();
    expect(diastolicFormField?.errors?.['required']).toBeTruthy();
  });

  it('should show the error when diastolic blood pressure not in range', async () => {
    const diastolicInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='diastolic']" }));
    await diastolicInputHarness.setValue('1');
    const diastolicFormField = component.form.get('diastolic');
    expect(diastolicFormField?.errors?.['min']).toBeTruthy();
    await diastolicInputHarness.setValue('252');
    expect(diastolicFormField?.errors?.['max']).toBeTruthy();
  });

  it('should show the error when systolic blood pressure not in range', async () => {
    const systolicInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='systolic']" }));
    await systolicInputHarness.setValue('1');
    const systolicFormField = component.form.get('systolic');
    expect(systolicFormField?.errors?.['min']).toBeTruthy();
    await systolicInputHarness.setValue('252');
    expect(systolicFormField?.errors?.['max']).toBeTruthy();
  });

  it('should submit blood pressure Form', async () => {
    const systolicInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='systolic']" }));
    await systolicInputHarness.setValue('100');
    const diastolicInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='diastolic']" }));
    await diastolicInputHarness.setValue('50');
    const submitButtonHarness = await loader.getHarness(MatButtonHarness.with({ selector: "[id='submit']" }));
    await submitButtonHarness.click();
    const bloodPressure = { systolic: 100, diastolic: 50 };
    expect(component.onSubmit).toBeTruthy();
    expect(fhirDataServiceSpy.createBloodPressureResource).toHaveBeenCalledWith(bloodPressure);
    expect(fhirDataServiceSpy.addPatientData).toHaveBeenCalledWith(fhirResource);
  });

  it('should emit a 1 after submiting a form', async () => {
    spyOn(component.resourceCreated, 'emit');
    const systolicInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='systolic']" }));
    await systolicInputHarness.setValue('110');
    const diastolicInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='diastolic']" }));
    await diastolicInputHarness.setValue('70');
    const submitButtonHarness = await loader.getHarness(MatButtonHarness.with({ selector: "[id='submit']" }));
    await submitButtonHarness.click();
    expect(component.resourceCreated.emit).toHaveBeenCalledWith(1);
  });
});

describe('snackbar test', () => {
  let fixture: ComponentFixture<ReportBPComponent>;
  let loader: HarnessLoader;
  let fhirDataServiceSpy: jasmine.SpyObj<FhirDataService>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    matSnackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
    fhirDataServiceSpy = jasmine.createSpyObj('FhirDataService', ['createBloodPressureResource', 'addPatientData']);
    fhirDataServiceSpy.createBloodPressureResource.and.returnValue(fhirResource);
    fhirDataServiceSpy.addPatientData.and.returnValue(of(fhirResource));
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NoopAnimationsModule, MatInputModule, MatCardModule],
      declarations: [ReportBPComponent],
      providers: [
        { provide: MatSnackBar, useValue: matSnackBarSpy },
        { provide: FhirDataService, useValue: fhirDataServiceSpy },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ReportBPComponent);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });

  it('should display success snackbar message when form submission is successful', fakeAsync(async () => {
    const systolicInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='systolic']" }));
    await systolicInputHarness.setValue('100');
    const diastolicInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='diastolic']" }));
    await diastolicInputHarness.setValue('50');
    const submitButtonHarness = await loader.getHarness(MatButtonHarness.with({ selector: "[id='submit']" }));
    await submitButtonHarness.click();

    expect(matSnackBarSpy.open).toHaveBeenCalledWith('Blood Pressure Added Sucessfully', 'Dismiss', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000,
      panelClass: ['green-snackbar'],
    });
  }));

  it('should display error snackbar message when getting some error', fakeAsync(async () => {
    fhirDataServiceSpy.addPatientData.and.returnValue(throwError(() => new Error('error')))
    const systolicInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='systolic']" }));
    await systolicInputHarness.setValue('100');
    const diastolicInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='diastolic']" }));
    await diastolicInputHarness.setValue('50');
    const submitButtonHarness = await loader.getHarness(MatButtonHarness.with({ selector: "[id='submit']" }));
    await submitButtonHarness.click();

    expect(matSnackBarSpy.open).toHaveBeenCalledWith('Something Wrong', 'Dismiss', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['red-snackbar'],
      duration: 5000,
    });
  }));
});