import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetTagsLegendComponent } from './dataset-tags-legend.component';

describe('DatasetTagsLegendComponent', () => {
  let component: DatasetTagsLegendComponent;
  let fixture: ComponentFixture<DatasetTagsLegendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatasetTagsLegendComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatasetTagsLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
