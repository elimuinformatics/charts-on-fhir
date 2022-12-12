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

  it('when onAnnotationsChange called it should emit event', () => {
    let oldAnnotation: any = {
      label: {
        display: true,
        position: { x: 'start', y: 'end' },
        color: '#666666',
        font: { size: 16, weight: 'normal' },
        content: 'Systolic Blood Pressure Reference Range',
      },
      type: 'box',
      backgroundColor: '#ECF0F9',
      borderWidth: 0,
      drawTime: 'beforeDraw',
      display: false,
      yScaleID: 'mm[Hg]',
      yMax: 130,
      yMin: 90,
    };

    let newAnnotation: any = {
      label: {
        display: true,
        position: { x: 'start', y: 'end' },
        color: '#666666',
        font: { size: 16, weight: 'normal' },
        content: 'Systolic Blood Pressure Reference Range',
      },
      type: 'box',
      backgroundColor: '#ECF0F9',
      borderWidth: 0,
      drawTime: 'beforeDraw',
      display: false,
      yScaleID: 'mm[Hg]',
      yMax: 130,
      yMin: 90,
    };
    component._annotations = [
      {
        label: {
          display: true,
          position: { x: 'start', y: 'end' },
          color: '#666666',
          font: { size: 16, weight: 'normal' },
          content: 'Systolic Blood Pressure Reference Range',
        },
        type: 'box',
        backgroundColor: '#ECF0F9',
        borderWidth: 0,
        drawTime: 'beforeDraw',
        display: false,
        yScaleID: 'mm[Hg]',
        yMax: 130,
        yMin: 90,
      },
      {
        label: {
          display: true,
          position: { x: 'start', y: 'end' },
          color: '#666666',
          font: { size: 16, weight: 'normal' },
          content: 'Diastolic Blood Pressure Reference Range',
        },
        type: 'box',
        backgroundColor: '#ECF0F9',
        borderWidth: 0,
        drawTime: 'beforeDraw',
        display: true,
        yScaleID: 'mm[Hg]',
        yMax: 80,
        yMin: 60,
      },
    ];
    const emitSpy = spyOn(component.annotationsChange, 'emit');
    component.onAnnotationsChange(oldAnnotation, newAnnotation);
    expect(emitSpy).toHaveBeenCalled();
  });

  it('when trackByIndex called it should return index', () => {
    const index = 0;
    const trackIndex = component.trackByIndex(index);
    expect(trackIndex).toBe(0);
  });
});
