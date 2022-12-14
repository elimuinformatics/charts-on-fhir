import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DataLayerListComponent } from './data-layer-list/data-layer-list.component';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DatasetListComponent } from './dataset-list/dataset-list.component';
import { DataLayerOptionsComponent } from './data-layer-options/data-layer-options.component';
import { DatasetOptionsComponent } from './dataset-options/dataset-options.component';
import { ColorPickerModule } from '../color-picker/color-picker.module';
import { MatInputModule } from '@angular/material/input';
import { DatasetAnnotationsComponent } from './dataset-annotatitons/dataset-annotations.component';
import { DatasetAnnotationListComponent } from './dataset-annotation-list/dataset-annotation-list.component';

@NgModule({
  declarations: [DataLayerListComponent, DatasetListComponent, DataLayerOptionsComponent, DatasetOptionsComponent, DatasetAnnotationsComponent, DatasetAnnotationListComponent ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DragDropModule,
    MatIconModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    ColorPickerModule,
    MatInputModule
  ],
  exports: [DataLayerListComponent],
})
export class DataLayerListModule {}
