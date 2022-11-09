import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataLayerOptionsComponent } from './data-layer-options.component';

describe('DataLayerOptionsComponent', () => {
  let component: DataLayerOptionsComponent;
  let fixture: ComponentFixture<DataLayerOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataLayerOptionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataLayerOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
