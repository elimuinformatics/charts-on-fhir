import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ReportBPComponent } from './report-bp.component';
import { MatInputHarness } from '@angular/material/input/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DataLayerManagerService } from 'ngx-charts-on-fhir';
import { EMPTY } from 'rxjs';

const mockLayerManager = {
  availableLayers$: EMPTY,
  selectedLayers$: EMPTY,
};

describe('ReportBPComponent', () => {
  let component: ReportBPComponent;
  let fixture: ComponentFixture<ReportBPComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NoopAnimationsModule, MatInputModule, MatFormFieldModule],
      declarations: [ReportBPComponent],
      providers: [FormBuilder, { provide: DataLayerManagerService, useValue: mockLayerManager }],
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
});
