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
  remove() {},
  update() {},
  enable() {},
  move() {},
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
  describe('getLayerId', () => {
    it('should return layer id when getLayerId called ', () => {
      const index: any = 0;
      const layer: any = {
        id: '-109669932',
        name: 'Blood Pressure',
        category: 'vital-signs',
        datasets: [],
      };
      const getId = component.getLayerId(index, layer);
      const layerId = '-109669932';
      expect(getId).toEqual(layerId);
    });
  });

  describe('isCheckboxChecked', () => {
    it('should return true when isCheckboxChecked called ', () => {
      const layer: any = {
        id: '-109669932',
        name: 'Blood Pressure',
        category: 'vital-signs',
        annotations: [],
        selected: true,
        enabled: true,
      };
      expect(component.isCheckboxChecked(layer)).toBe(true);
    });
  });
  describe('isCheckboxIndeterminate', () => {
    it('should return false when isCheckboxIndeterminate called ', () => {
      const layer: any = {
        id: '-109669932',
        name: 'Blood Pressure',
        category: 'vital-signs',
        datasets: [],
        selected: true,
        enabled: true,
      };
      expect(component.isCheckboxIndeterminate(layer)).toBe(false);
    });
  });
  describe('onLayerRemove', () => {
    it('should call remove function on onLayer function call ', () => {
      const layer: any = {
        id: '-109669932',
      };
      const layerSpy = spyOn(mockLayerManager, 'remove');
      component.onLayerRemove(layer);
      expect(layerSpy).toHaveBeenCalled();
    });
  });

  describe('onLayerChange', () => {
    it('should call update function on onLayerChange function call  ', () => {
      const layer: any = {
        id: '-109669932',
      };
      const layerSpy = spyOn(mockLayerManager, 'update').and.callThrough();
      component.onLayerChange(layer);
      expect(layerSpy).toHaveBeenCalled();
    });
  });

  describe('onCheckboxChange', () => {
    it('should call enable function on onCheckboxChange function call  ', () => {
      const layer: any = {
        id: '-109669932',
      };
      const event: any = {
        checked: false,
      };
      const layerSpy = spyOn(mockLayerManager, 'enable').and.callThrough();
      component.onCheckboxChange(layer, event);
      expect(layerSpy).toHaveBeenCalled();
    });
  });

  describe('onDrop', () => {
    it('should call move function on onDrop function call  ', () => {
      const event: any = {
        checked: false,
      };
      const layerSpy = spyOn(mockLayerManager, 'move').and.callThrough();
      component.onDrop(event);
      expect(layerSpy).toHaveBeenCalled();
    });
  });
});
