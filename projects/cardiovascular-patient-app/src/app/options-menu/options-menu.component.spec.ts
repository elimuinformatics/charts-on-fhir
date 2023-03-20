import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OptionsMenuComponent } from './options-menu.component';
import { OptionsMenuModule } from './options-menu.module';

describe('OptionsMenuComponent', () => {
  let component: OptionsMenuComponent;
  let fixture: ComponentFixture<OptionsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionsMenuModule],
    }).compileComponents();

    fixture = TestBed.createComponent(OptionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
