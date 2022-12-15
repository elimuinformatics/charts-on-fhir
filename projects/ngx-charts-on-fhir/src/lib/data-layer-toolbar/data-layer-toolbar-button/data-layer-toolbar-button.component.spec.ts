import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataLayerToolbarModule } from '../data-layer-toolbar.module';
import { DataLayerToolbarButtonComponent } from './data-layer-toolbar-button.component';

describe('DataLayerToolbarButtonComponent', () => {
  let component: DataLayerToolbarButtonComponent;
  let fixture: ComponentFixture<DataLayerToolbarButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataLayerToolbarModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DataLayerToolbarButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
