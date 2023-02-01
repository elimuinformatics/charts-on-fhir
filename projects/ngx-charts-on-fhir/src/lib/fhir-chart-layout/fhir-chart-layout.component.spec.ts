import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FhirChartLayoutComponent } from './fhir-chart-layout.component';

@Component({ selector: 'data-layer-toolbar', template: '' })
class MockDataLayerToolbarComponent {
  @Input() active?: any;
  @Input() buttons?: any;
}

@Component({ selector: 'data-layer-browser', template: '' })
class MockDataLayerBrowserComponent {}

@Component({ selector: 'data-layer-list', template: '' })
class MockDataLayerListComponent {}

describe('FhirChartLayoutComponent', () => {
  let component: FhirChartLayoutComponent;
  let fixture: ComponentFixture<FhirChartLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FhirChartLayoutComponent, MockDataLayerToolbarComponent, MockDataLayerBrowserComponent, MockDataLayerListComponent],
      imports: [NoopAnimationsModule, MatSidenavModule, MatIconModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FhirChartLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
