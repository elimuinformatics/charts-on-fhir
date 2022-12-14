import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { DatasetAnnotationListComponent } from './dataset-annotation-list.component';

describe('DatasetAnnotationListComponent', () => {
  let component: DatasetAnnotationListComponent;
  let fixture: ComponentFixture<DatasetAnnotationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatasetAnnotationListComponent],
      imports: [MatExpansionModule, MatCheckboxModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DatasetAnnotationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
