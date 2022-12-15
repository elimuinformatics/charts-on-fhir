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
    it('should update view, control and emit the option if an option is clicked', () => {
      spyOn(component.annotationsChange, 'emit');
      const annotation = { label: { display: true } };
      component.annotations = [annotation];
      let event: any = { checked: true };
      component.onCheckboxChange(annotation, event);
      expect(component.annotationsChange.emit).toHaveBeenCalled();
    });
    it('should set display=true when checked', async () => {
      let event: any = { checked: true };
      let annotations = [{ label: { display: true } }];
      component.annotations = annotations;
      spyOn(component, 'onCheckboxChange');
      const checkbox = await loader.getHarness(MatCheckboxHarness);
      await checkbox.check();
      component.annotationsChange.subscribe((e) => {
        expect(e).toEqual(event);
      });
    });
  });

  describe('onAnnotationsChange', () => {
    it('should update view, control and emit the option if an option is clicked', () => {
      spyOn(component.annotationsChange, 'emit');
      const oldAnnotation = { label: { display: true } };
      const newAnnotation = { label: { display: false } };
      component.annotations = [oldAnnotation];
      component.onAnnotationsChange(oldAnnotation, newAnnotation);
      expect(component.annotationsChange.emit).toHaveBeenCalled();
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
