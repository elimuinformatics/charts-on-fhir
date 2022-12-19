import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { COLOR_PALETTE, DataLayerColorService } from '../../data-layer/data-layer-color.service';
import { AnnotationOptionsComponent } from './annotation-options.component';
import { MatInputHarness } from '@angular/material/input/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ColorPickerModule } from '../../color-picker/color-picker.module';

describe('AnnotationOptionsComponent', () => {
  let component: AnnotationOptionsComponent;
  let fixture: ComponentFixture<AnnotationOptionsComponent>;
  let colorService: DataLayerColorService;
  let palette: string[] = ['#FFFFFF', '#121212', '#000000'];
  let loader: HarnessLoader;

  beforeEach(async () => {
    colorService = new DataLayerColorService(palette);
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NoopAnimationsModule, MatInputModule, MatFormFieldModule, ColorPickerModule],
      declarations: [AnnotationOptionsComponent],
      providers: [FormBuilder, { provide: DataLayerColorService, useValue: colorService }, { provide: COLOR_PALETTE, useValue: palette }],
    }).compileComponents();

    fixture = TestBed.createComponent(AnnotationOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update annotation label when input is changed', async () => {
    let labelInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='annotationLabel']" }));
    let labelInputControl = fixture.componentInstance.form.controls['label'];
    const testLabel = 'test label';
    await labelInputHarness.setValue(testLabel);
    expect(labelInputControl.value).toBe(testLabel);
  });

  it('should update annotation yMax when input is changed', async () => {
    let yMaxInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='yMax']" }));
    let yMaxInputControl = fixture.componentInstance.form.controls['yMax'];
    await yMaxInputHarness.setValue('100');
    expect(yMaxInputControl.value).toBe(100);
  });

  it('should update annotation yMin when input is changed', async () => {
    let yMinInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='yMin']" }));
    let yMinInputControl = fixture.componentInstance.form.controls['yMin'];
    await yMinInputHarness.setValue('100');
    expect(yMinInputControl.value).toBe(100);
  });

  it('should update form when input is change', async () => {
    let annotation = { label: { content: 'Test' }, yMin: 100, yMax: 200 };
    component.annotation = annotation;
    let labelInputControl = fixture.componentInstance.form.controls['label'];
    let yMaxInputControl = fixture.componentInstance.form.controls['yMax'];
    let yMinInputControl = fixture.componentInstance.form.controls['yMin'];
    let labelInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='annotationLabel']" }));
    let yMinInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='yMin']" }));
    let yMaxInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='yMax']" }));
    expect(labelInputControl.value).toBe('Test');
    expect(yMaxInputControl.value).toBe(200);
    expect(yMinInputControl.value).toBe(100);
    expect(await labelInputHarness.getValue()).toBe('Test');
    expect(await yMinInputHarness.getValue()).toBe('100');
    expect(await yMaxInputHarness.getValue()).toBe('200');
  });
});
