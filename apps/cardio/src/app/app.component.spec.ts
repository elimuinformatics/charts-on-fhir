import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { COLOR_PALETTE, DataLayerColorService, DataLayerManagerService, DataLayerMergeService, DataLayerService } from '@elimuinformatics/ngx-charts-on-fhir';
import { EMPTY } from 'rxjs';
import { AppComponent } from './app.component';

class MockDataLayerService implements DataLayerService {
  name = 'MockDataLayerService';
  retrieve = () => EMPTY;
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let colorService: DataLayerColorService;
  let palette: string[] = ['#FFFFFF', '#121212', '#000000'];

  beforeEach(async () => {
    colorService = new DataLayerColorService(palette);
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, AppComponent],
      providers: [
        { provide: DataLayerService, useClass: MockDataLayerService, multi: true },
        { provide: COLOR_PALETTE, useValue: ['#ffffff', '#000000'] },
        { provide: DataLayerColorService, useValue: colorService },
        DataLayerManagerService,
        DataLayerMergeService,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
