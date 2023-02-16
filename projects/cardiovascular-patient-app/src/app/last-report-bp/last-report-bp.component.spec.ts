import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LastReportBPComponent } from './last-report-bp.component';
import { DataLayerManagerService, ManagedDataLayer } from 'ngx-charts-on-fhir';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { LastReportBPModule } from './last-report-bp.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import {MatCardHarness} from '@angular/material/card/testing';


class MockLayerManager {
  allLayers$ = new BehaviorSubject<ManagedDataLayer[]>([]);
  selectedLayers$ = EMPTY;
  availableLayers$ = EMPTY;
}

describe('LastReportBPComponent', () => {
  let component: LastReportBPComponent;
  let fixture: ComponentFixture<LastReportBPComponent>;
  let layerManager: MockLayerManager;
  let loader: HarnessLoader;

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
              { x: 1609175027000, y: 120 },
              { x: 1609175027000, y: 122 },
            ],
          },
          {
            data: [
              { x: 1676536294000, y: 80 },
              { x: 1676536294000, y: 78 },
            ],
          },
        ],
        scale: { id: '1' },
      },
    ];
    layerManager.allLayers$.next(layers);

    const cardHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, MatCardHarness);
    const contentText = await cardHarness.getText();
    expect(contentText).toContain('Last BP reported was 78/122 on 16 Feb 2023 at 2:01 PM');
  });

  it('should check if no any blood pressure layer is present', async () => {
    const layers: ManagedDataLayer[] = [
      {
        id: '1',
        name: 'Medications',
        category: ['C', 'D'],
        datasets: [
          {
            data: [
              { x: 1609175027000, y: 120 },
              { x: 1609175027000, y: 122 },
            ],
          },
          {
            data: [
              { x: 1676536294000, y: 80 },
              { x: 1676536294000, y: 78 },
            ],
          },
        ],
        scale: { id: '1' },
      },
    ];
    layerManager.allLayers$.next(layers);

    const cardHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, MatCardHarness);
    const contentText = await cardHarness.getText();
    expect(contentText).toContain('There is no last reported prior BP for Patient');
  });
});