import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceRangeComponent } from './reference-range.component';

describe('ReferenceRangeComponent', () => {
  let component: ReferenceRangeComponent;
  let fixture: ComponentFixture<ReferenceRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenceRangeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReferenceRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
