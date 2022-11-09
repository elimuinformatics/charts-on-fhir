import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { DataLayerColorService, COLOR_PALETTE } from '../../data-layer/data-layer-color.service';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { DataLayerListModule } from '../data-layer-list.module';
import { DataLayerListComponent } from './data-layer-list.component';

const mockColorService = {
  getColor: () => '#000000',
  setColor: () => {},
};

const mockLayerManager = {
  selectedLayers$: EMPTY,
  timelineRange$: EMPTY,
};

describe('FhirDatasetsComponent', () => {
  let component: DataLayerListComponent;
  let fixture: ComponentFixture<DataLayerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataLayerListModule],
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
