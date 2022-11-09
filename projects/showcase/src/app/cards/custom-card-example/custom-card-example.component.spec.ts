import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCardExampleComponent } from './custom-card-example.component';

describe('CustomCardExampleComponent', () => {
  let component: CustomCardExampleComponent;
  let fixture: ComponentFixture<CustomCardExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomCardExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomCardExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
