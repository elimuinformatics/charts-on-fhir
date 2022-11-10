import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { EMPTY } from 'rxjs';
import { DataLayer } from '../../data-layer/data-layer';
import { DataLayerColorService, COLOR_PALETTE } from '../../data-layer/data-layer-color.service';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { DataLayerListComponent } from './data-layer-list.component';

const mockColorService = {
  getColor: () => '#000000',
  setColor: () => {},
};

const mockLayerManager = {
  selectedLayers$: EMPTY,
  timelineRange$: EMPTY,
};

@Component({ selector: 'data-layer-options', template: '' })
class MockDataLayerOptionsComponent {
  @Input() layer?: DataLayer;
}

describe('FhirDatasetsComponent', () => {
  let component: DataLayerListComponent;
  let fixture: ComponentFixture<DataLayerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataLayerListComponent, MockDataLayerOptionsComponent],
      imports: [MatExpansionModule, DragDropModule],
      providers: [
        { provide: DataLayerManagerService, useValue: mockLayerManager },
        { provide: DataLayerColorService, useValue: mockColorService },
        { provide: COLOR_PALETTE, useValue: ['#000000', '#ffffff'] },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DataLayerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
