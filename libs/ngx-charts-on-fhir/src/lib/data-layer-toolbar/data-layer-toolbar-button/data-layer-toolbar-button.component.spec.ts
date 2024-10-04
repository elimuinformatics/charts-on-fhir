import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataLayerToolbarButtonComponent } from './data-layer-toolbar-button.component';
import { DataLayerToolbarComponent } from '../data-layer-toolbar/data-layer-toolbar.component';

describe('DataLayerToolbarButtonComponent', () => {
  let component: DataLayerToolbarButtonComponent;
  let fixture: ComponentFixture<DataLayerToolbarButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataLayerToolbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataLayerToolbarButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
