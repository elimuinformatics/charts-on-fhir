import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { DataLayerToolbarComponent } from './data-layer-toolbar.component';
import { PatientService } from '../../patient-browser/patient.service';

const mockLayerManager = {
  availableLayers$: EMPTY,
  selectedLayers$: EMPTY,
};

describe('DataLayerToolbarComponent', () => {
  let component: DataLayerToolbarComponent;
  let fixture: ComponentFixture<DataLayerToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataLayerToolbarComponent],
      providers: [
        { provide: DataLayerManagerService, useValue: mockLayerManager },
        { provide: PatientService, useValue: PatientService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DataLayerToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
