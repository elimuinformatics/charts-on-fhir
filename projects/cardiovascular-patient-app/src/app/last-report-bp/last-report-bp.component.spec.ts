import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LastReportBPComponent } from './last-report-bp.component';
import { DataLayerManagerService, ManagedDataLayer } from 'ngx-charts-on-fhir';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { LastReportBPModule } from './last-report-bp.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


class MockLayerManager {
  allLayers$ = new BehaviorSubject<ManagedDataLayer[]>([]);
  selectedLayers$ = EMPTY;
  availableLayers$ = EMPTY;
}

describe('LastReportBPComponent', () => {
  let component: LastReportBPComponent;
  let fixture: ComponentFixture<LastReportBPComponent>;
  let layerManager: MockLayerManager;

  beforeEach(async () => {
    layerManager = new MockLayerManager();
    await TestBed.configureTestingModule({
      imports: [LastReportBPModule, NoopAnimationsModule],
      providers: [
        { provide: DataLayerManagerService, useValue: layerManager }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LastReportBPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extract the last data point of each dataset in the "Blood Pressure" layer', async () => {
    const layers: ManagedDataLayer[] = [
      {
        id: '1',
        name: 'Blood Pressure',
        category: ['C', 'D'],
        datasets: [
          {
            data: [
              { x: 1352359652, y: 120 },
              { x: 1352359652, y: 122 },
            ],
          },
          {
            data: [
              { x: 1476359652, y: 80 },
              { x: 1476359652, y: 78 },
            ],
          },
        ],
        scale: { id: '1' },
      },
    ];
    layerManager.allLayers$.next(layers);
    expect(component.lastReportedBPdata?.systolic).toEqual({date:'18 Jan 1970 at 7:35 AM', value:78});
    expect(component.lastReportedBPdata?.diastolic).toEqual({date:'16 Jan 1970 at 9:09 PM', value:122})

  });
});
