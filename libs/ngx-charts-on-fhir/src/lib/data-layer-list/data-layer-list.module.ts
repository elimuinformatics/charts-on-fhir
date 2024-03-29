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
import { AnnotationOptionsComponent } from './annotation-options/annotation-options.component';
import { AnnotationListComponent } from './annotation-list/annotation-list.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';

@NgModule({
  declarations: [
    DataLayerListComponent,
    DatasetListComponent,
    DataLayerOptionsComponent,
    AnnotationOptionsComponent,
    AnnotationListComponent,
    DatasetOptionsComponent,
  ],
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
    MatInputModule,
    MatTooltipModule,
    MatSliderModule,
  ],
  exports: [DataLayerListComponent],
})
export class DataLayerListModule {}
