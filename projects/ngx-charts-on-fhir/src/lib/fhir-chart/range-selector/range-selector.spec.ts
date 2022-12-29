import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RangeSelectorModule } from './range-selector.module';
import { RangeSelectorComponent } from './range-selector.component';

describe('DataLayerToolbarButtonComponent', () => {
  let component: RangeSelectorComponent;
  let fixture: ComponentFixture<RangeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangeSelectorModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RangeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
