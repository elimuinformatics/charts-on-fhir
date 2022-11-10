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
});
