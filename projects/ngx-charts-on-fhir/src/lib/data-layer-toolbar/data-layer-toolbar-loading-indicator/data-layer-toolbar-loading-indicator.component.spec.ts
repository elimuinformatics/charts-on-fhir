import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataLayerToolbarLoadingIndicatorComponent } from './data-layer-toolbar-loading-indicator.component';

describe('DataLayerToolbarLoadingIndicatorComponent', () => {
  let component: DataLayerToolbarLoadingIndicatorComponent;
  let fixture: ComponentFixture<DataLayerToolbarLoadingIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataLayerToolbarLoadingIndicatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataLayerToolbarLoadingIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
