import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DataLayerToolbarLoadingIndicatorComponent } from './data-layer-toolbar-loading-indicator.component';

describe('DataLayerToolbarLoadingIndicatorComponent', () => {
  let component: DataLayerToolbarLoadingIndicatorComponent;
  let fixture: ComponentFixture<DataLayerToolbarLoadingIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [MatIconModule, MatProgressSpinnerModule, MatTooltipModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DataLayerToolbarLoadingIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
