import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { DataLayerColorService, COLOR_PALETTE } from '../data-layer/data-layer-color.service';
import { DataLayerManagerService } from '../data-layer/data-layer-manager.service';
import { DataLayerBrowserComponent } from './data-layer-browser.component';

const mockColorService = {
  getColor: () => '#000000',
  setColor: () => {},
};

const mockLayerManager = {
  availableLayers$: EMPTY,
  selectedLayers$: EMPTY,
  timelineRange$: EMPTY,
};

describe('DataLayerBrowserComponent', () => {
  let component: DataLayerBrowserComponent;
  let fixture: ComponentFixture<DataLayerBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataLayerBrowserComponent],
      providers: [
        { provide: DataLayerManagerService, useValue: mockLayerManager },
        { provide: DataLayerColorService, useValue: mockColorService },
        { provide: COLOR_PALETTE, useValue: ['#000000', '#ffffff'] },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DataLayerBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
