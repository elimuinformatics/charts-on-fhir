import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { AnnotationListComponent } from './annotation-list.component';

describe('DatasetAnnotationListComponent', () => {
  let component: AnnotationListComponent;
  let fixture: ComponentFixture<AnnotationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnotationListComponent],
      imports: [MatExpansionModule, MatCheckboxModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AnnotationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('onCheckboxChange', () => {
    it('should update view, control and emit the option if an option is clicked', () => {
      spyOn(component.annotationsChange, 'emit');
      const annotation={ "label": { "display": true, "position": { "x": "start", "y": "end" }, "color": "#666666", "font": { "size": 16, "weight": "normal" }, "content": "Systolic Blood Pressure Reference Range" }, "type": "box", "backgroundColor": "#ECF0F9", "borderWidth": 0, "drawTime": "beforeDraw", "display": false, "yScaleID": "mm[Hg]", "yMax": 130, "yMin": 90 };
      component.annotations = [annotation];
      let event: any= {
         checked : true
      }
      component.onCheckboxChange(annotation, event);
      expect(component.annotationsChange.emit).toHaveBeenCalled();
    });
  });

  describe('onAnnotationsChange', () => {
    it('should update view, control and emit the option if an option is clicked', () => {
      spyOn(component.annotationsChange, 'emit');
      const oldAnnotation={ "label": { "display": true, "position": { "x": "start", "y": "end" }, "color": "#666666", "font": { "size": 16, "weight": "normal" }, "content": "Systolic Blood Pressure Reference Range" }, "type": "box", "backgroundColor": "#ECF0F9", "borderWidth": 0, "drawTime": "beforeDraw", "display": false, "yScaleID": "mm[Hg]", "yMax": 130, "yMin": 90 };
      const newAnnotation={ "label": { "display": false, "position": { "x": "start", "y": "end" }, "color": "#666666", "font": { "size": 16, "weight": "normal" }, "content": "Systolic Blood Pressure Reference Range" }, "type": "box", "backgroundColor": "#ECF0F9", "borderWidth": 0, "drawTime": "beforeDraw", "display": false, "yScaleID": "mm[Hg]", "yMax": 130, "yMin": 90 };
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
