import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { DataLayerColorService, DataLayerManagerService, DataLayerService, DataLayerMergeService } from '@elimuinformatics/ngx-charts-on-fhir';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FhirDataService } from '@elimuinformatics/ngx-charts-on-fhir';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let colorService: DataLayerColorService;
  let palette: string[] = ['#FFFFFF', '#121212', '#000000'];

  beforeEach(async () => {
    const mockFhirDataService = jasmine.createSpyObj('FhirDataService', ['initialize', 'getPatientData', 'changePatient', 'isSmartLaunch'], {
      isSmartLaunch: false,
      client: {
        getPatientId: () => 'test-patient',
        getState: () => ({}),
      },
    });
    mockFhirDataService.getPatientData.and.returnValue(of({ resourceType: 'Bundle', type: 'searchset', entry: [] }));
    colorService = new DataLayerColorService(palette);
    await TestBed.configureTestingModule({
      imports: [AppComponent, NoopAnimationsModule],
      providers: [
        DataLayerMergeService,
        DataLayerManagerService,
        { provide: DataLayerService, useValue: { name: 'mock', retrieve: () => of() }, multi: true },
        { provide: DataLayerColorService, useValue: colorService },
        { provide: FhirDataService, useValue: mockFhirDataService },
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
