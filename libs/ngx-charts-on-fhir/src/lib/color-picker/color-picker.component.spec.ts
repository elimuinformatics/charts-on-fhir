import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COLOR_PALETTE } from '../data-layer/data-layer-color.service';

import { ColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorPickerComponent],
      providers: [{ provide: COLOR_PALETTE, useValue: ['#000000', '#ffffff'] }],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
