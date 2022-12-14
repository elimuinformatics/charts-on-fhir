import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dataset } from '../../data-layer/data-layer';
import { DataLayerOptionsComponent } from './data-layer-options.component';

@Component({ selector: 'dataset-list', template: '' })
class MockDatasetListComponent {
  @Input() datasets?: Dataset[];
}

describe('DataLayerOptionsComponent', () => {
  let component: DataLayerOptionsComponent;
  let fixture: ComponentFixture<DataLayerOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataLayerOptionsComponent, MockDatasetListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataLayerOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('onDatasetsChange', () => {
    it('should emit event when onDatasetsChange called ', () => {
      let dataset: any = [
        {
          label: 'Diastolic Blood Pressure',
          yAxisID: 'mm[Hg]',
          data: [
            { x: 1359454965000, y: 96 },
            { x: 1362478965000, y: 90 },
          ],
        },
      ];
      component.onDatasetsChange(dataset);
      component.change.subscribe((next) => {
        expect(next).toHaveBeenCalled();
      });
    });
  });
  describe('onAnnotationsChange', () => {
    it('when onAnnotationsChange() called it should emit event', () => {
      let annotations: any = [
        {
          label: {
            display: true,
          },
        },
      ];

      component.onAnnotationsChange(annotations);
      component.change.subscribe((next) => {
        expect(next).toHaveBeenCalled();
      });
    });
  });
});
