import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { AnnotationListComponent } from './annotation-list.component';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DatasetAnnotationListComponent', () => {
  let component: AnnotationListComponent;
  let fixture: ComponentFixture<AnnotationListComponent>;
  let loader: HarnessLoader;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnotationListComponent],
      imports: [MatExpansionModule, MatCheckboxModule, BrowserAnimationsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(AnnotationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('onCheckboxChange', () => {
    it('should set display true when checked', async () => {
      let emitted: any;
      component.annotationsChange.subscribe((e) => (emitted = e));
      const annotations = [{ label: { content: 'Test', display: true }, display: false }];
      component.annotations = annotations;
      let expectedOutput: any = [{ label: { content: 'Test', display: true }, display: true }];
      let checkBoxHarness = await loader.getHarness(MatCheckboxHarness.with({ selector: "[id='annotationDisplayCheckBox']" }));
      await checkBoxHarness.check();
      expect(emitted).toEqual(expectedOutput);
    });
    it('should set display false when unchecked', async () => {
      let emitted: any;
      component.annotationsChange.subscribe((e) => (emitted = e));
      const annotations = [{ label: { content: 'Test', display: true }, display: true }];
      component.annotations = annotations;
      let expectedOutput: any = [{ label: { content: 'Test', display: true }, display: false }];
      let checkBoxHarness = await loader.getHarness(MatCheckboxHarness.with({ selector: "[id='annotationDisplayCheckBox']" }));
      await checkBoxHarness.uncheck();
      expect(emitted).toEqual(expectedOutput);
    });
  });

  describe('onAnnotationsChange', () => {
    it('should emit annotationsChange event with updated annotations', () => {
      let emitted: any;
      component.annotationsChange.subscribe((e) => (emitted = e));
      const oldAnnotation = { label: { display: true } };
      const newAnnotation = { label: { display: false } };
      component.annotations = [oldAnnotation];
      component.onAnnotationsChange(oldAnnotation, newAnnotation);
      expect(emitted).toEqual([newAnnotation]);
    });
  });

  describe('trackByIndex', () => {
    it('should return index when trackByIndex called ', () => {
      const index = 0;
      const trackIndex = component.trackByIndex(index);
      expect(trackIndex).toBe(0);
    });
  });
});
