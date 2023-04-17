import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatasetTagsLegendComponent } from './dataset-tags-legend.component';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { EMPTY } from 'rxjs';

const mockLayerManager = {
  enabledLayers$: EMPTY,
};

describe('DatasetTagsLegendComponent', () => {
  let component: DatasetTagsLegendComponent;
  let fixture: ComponentFixture<DatasetTagsLegendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatasetTagsLegendComponent],
      providers: [{ provide: DataLayerManagerService, useValue: mockLayerManager }],
    }).compileComponents();

    fixture = TestBed.createComponent(DatasetTagsLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
