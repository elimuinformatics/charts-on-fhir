import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dataset } from '../../data-layer/data-layer';
import { DataLayerOptionsComponent } from './data-layer-options.component';

@Component({ selector: 'dataset-list', template: '' })
class MockDatasetListComponent {
  @Input() datasets?: Dataset[];
}

@Component({ selector: 'annotation-list', template: '' })
class MockAnnotationListComponent {
  @Input() annotations?: any[];
}

describe('DataLayerOptionsComponent', () => {
  let component: DataLayerOptionsComponent;
  let fixture: ComponentFixture<DataLayerOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataLayerOptionsComponent, MockDatasetListComponent, MockAnnotationListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataLayerOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('onDatasetsChange', () => {
    it('should emit event, when onDatasetsChange called', () => {
      spyOn(component.layerChange, 'emit');
      const datasets: any = [
        {
          label: 'Diastolic Blood Pressure',
          yAxisID: 'mm[Hg]',
          data: [
            { x: 1359454965000, y: 96 },
            { x: 1362478965000, y: 90 },
          ],
          cubicInterpolationMode: 'default',
          fill: false,
        },
      ];
      component.layer = {
        id: '-109669932',
        name: 'Blood Pressure',
        category: 'vital-signs',
        datasets: [
          {
            label: 'Diastolic Blood Pressure',
            yAxisID: 'mm[Hg]',
            data: [
              { x: 1359454965000, y: 96 },
              { x: 1362478965000, y: 90 },
            ],
          },
        ],
        scales: {},
        annotations: [],
      };
      component.onDatasetsChange(datasets);

      expect(component.layerChange.emit).toHaveBeenCalled();
    });
  });
  describe('onAnnotationsChange', () => {
    it('should emit event, when onAnnotationsChange called', () => {
      spyOn(component.layerChange, 'emit');
      const annotations: any = [
        {
          label: {
            display: true,
          },
        },
      ];
      component.layer = {
        id: '-109669932',
        name: 'Blood Pressure',
        category: 'vital-signs',
        datasets: [],
        scales: {},
        annotations: [],
      };
      component.onAnnotationsChange(annotations);

      expect(component.layerChange.emit).toHaveBeenCalled();
    });
  });
});
