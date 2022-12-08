import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { DataLayerToolbarModule } from '../data-layer-toolbar.module';
import { DataLayerToolbarComponent } from './data-layer-toolbar.component';

const mockLayerManager = {
  availableLayers$: EMPTY,
  selectedLayers$: EMPTY,
  timelineRange$: EMPTY,
};

describe('DataLayerToolbarComponent', () => {
  let component: DataLayerToolbarComponent;
  let fixture: ComponentFixture<DataLayerToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataLayerToolbarModule],
      providers: [
        { provide: DataLayerManagerService, useValue: mockLayerManager },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DataLayerToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
