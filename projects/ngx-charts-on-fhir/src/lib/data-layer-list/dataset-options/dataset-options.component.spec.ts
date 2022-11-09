import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COLOR_PALETTE, DataLayerColorService } from '../../data-layer/data-layer-color.service';
import { DataLayerListModule } from '../data-layer-list.module';

import { DatasetOptionsComponent } from './dataset-options.component';

const mockColorService = {
  getColor: () => '#000000',
  setColor: () => {},
};

describe('DatasetOptionsComponent', () => {
  let component: DatasetOptionsComponent;
  let fixture: ComponentFixture<DatasetOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataLayerListModule],
      providers: [
        { provide: DataLayerColorService, useValue: mockColorService },
        { provide: COLOR_PALETTE, useValue: ['#000000', '#ffffff'] },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatasetOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
