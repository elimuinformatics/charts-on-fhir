import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FhirChartLayoutComponent } from './fhir-chart-layout.component';
import { DataLayerManagerService, DataLayerService } from '../data-layer/data-layer-manager.service';
import { EMPTY } from 'rxjs';
import { SharedDataLayerListService } from '../data-layer-list/shared-data-layer-list.service';
import { DataLayerColorService } from '../data-layer/data-layer-color.service';
import { DataLayerMergeService } from '../data-layer/data-layer-merge.service';
import { PatientService } from '../patient-browser/patient.service';

@Component({ selector: 'data-layer-toolbar', template: '' })
class MockDataLayerToolbarComponent {
  @Input() active?: any;
  @Input() buttons?: any;
}

@Component({ selector: 'data-layer-browser', template: '' })
class MockDataLayerBrowserComponent {}

@Component({ selector: 'data-layer-list', template: '' })
class MockDataLayerListComponent {
  @Input() hideRemoveLayerButton?: boolean = false;
}

const mockSharedDataLayerListService = {
  showAdvancedOptions$: EMPTY,
};

describe('FhirChartLayoutComponent', () => {
  let component: FhirChartLayoutComponent;
  let fixture: ComponentFixture<FhirChartLayoutComponent>;
  let colorService: DataLayerColorService;
  let palette: string[] = ['#FFFFFF', '#121212', '#000000'];

  beforeEach(async () => {
    colorService = new DataLayerColorService(palette);
    await TestBed.configureTestingModule({
      declarations: [MockDataLayerToolbarComponent, MockDataLayerBrowserComponent, MockDataLayerListComponent],
      imports: [NoopAnimationsModule, MatSidenavModule, MatIconModule],
      providers: [
        { provide: SharedDataLayerListService, useValue: mockSharedDataLayerListService },
        { provide: DataLayerColorService, useValue: colorService },
        DataLayerManagerService,
        DataLayerMergeService,
        DataLayerService,
        PatientService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FhirChartLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
