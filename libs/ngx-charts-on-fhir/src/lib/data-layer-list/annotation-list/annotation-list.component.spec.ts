import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { AnnotationListComponent } from './annotation-list.component';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, Input } from '@angular/core';
import { DataLayerColorService } from '../../data-layer/data-layer-color.service';
import { AnnotationOptionsComponent } from '../annotation-options/annotation-options.component';

@Component({
  selector: 'annotation-options',
  template: '',
})
class MockAnnotationOptionsComponent {
  @Input() annotation?: any;
}

describe('DatasetAnnotationListComponent', () => {
  let component: AnnotationListComponent;
  let fixture: ComponentFixture<AnnotationListComponent>;
  let loader: HarnessLoader;
  let colorService: DataLayerColorService;

  let palette: string[] = ['#FFFFFF', '#121212', '#000000'];

  beforeEach(fakeAsync(() => {
    colorService = new DataLayerColorService(palette);

    TestBed.configureTestingModule({
      imports: [MatExpansionModule, MatCheckboxModule, NoopAnimationsModule, MockAnnotationOptionsComponent],
      providers: [{ provide: DataLayerColorService, useValue: colorService }],
    });
    TestBed.overrideComponent(AnnotationListComponent, {
      remove: { imports: [AnnotationOptionsComponent] },
      add: { imports: [MockAnnotationOptionsComponent] },
    });
    TestBed.compileComponents();
    fixture = TestBed.createComponent(AnnotationListComponent);
    component = fixture.componentInstance;
    component.annotations = [];
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('onCheckboxChange', () => {
    it('should set display true when checked', fakeAsync(async () => {
      let emitted: any;
      component.annotationsChange.subscribe((e) => (emitted = e));
      const annotations = [{ label: { content: 'Test', display: true }, display: false }];
      component.annotations = annotations;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      let expectedOutput: any = [{ label: { content: 'Test', display: true }, display: true }];
      let checkBoxHarness = await loader.getHarness(MatCheckboxHarness.with({ selector: '[id]' }));
      await checkBoxHarness.check();
      tick();
      fixture.detectChanges();
      expect(emitted).toEqual(expectedOutput);
    }));
    it('should set display false when unchecked', fakeAsync(async () => {
      let emitted: any;
      component.annotationsChange.subscribe((e) => (emitted = e));
      const annotations = [{ label: { content: 'Test', display: true }, display: true }];
      component.annotations = annotations;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      let expectedOutput: any = [{ label: { content: 'Test', display: true }, display: false }];
      let checkBoxHarness = await loader.getHarness(MatCheckboxHarness.with({ selector: '[id]' }));
      await checkBoxHarness.uncheck();
      tick();
      fixture.detectChanges();
      expect(emitted).toEqual(expectedOutput);
    }));
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
