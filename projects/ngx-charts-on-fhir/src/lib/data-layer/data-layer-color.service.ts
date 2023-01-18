import { forwardRef, Inject, Injectable, InjectionToken } from '@angular/core';
import { DataLayer, Dataset } from './data-layer';
import { DataLayerModule } from './data-layer.module';

export const COLOR_PALETTE = new InjectionToken<string[]>('Color Palette');

@Injectable({
  providedIn: forwardRef(() => DataLayerModule),
})
export class DataLayerColorService {
  constructor(@Inject(COLOR_PALETTE) private readonly palette: string[]) { }

  private nextColorIndex = 0;

  chooseColorsFromPalette(layer: DataLayer): void {
    for (let dataset of layer.datasets) {
      if (!this.getColor(dataset)) {
        const color = this.palette[this.nextColorIndex];
        this.nextColorIndex = (this.nextColorIndex + 1) % this.palette.length;
        this.setColor(dataset, color);
      }
    }
  }

  setAnnotationColor(annotation: any, color?: string): void {
    const line = annotation;
    line.backgroundColor = color + '33'; // temporary dirty hack to set opacity. assumes color is in 6-character hex format.
  }

  addTransparency(color: string | undefined): string | undefined {
    if (typeof color === 'string' && !color.endsWith('33')) {
      return color + '33';
    }
    return color;
  }

  setColor(dataset: Dataset, color: string): void {
    const line = dataset as Dataset<'line'>;
    line.borderColor = color;
    line.backgroundColor = color + '33'; // temporary dirty hack to set opacity. assumes color is in 6-character hex format.
    line.pointBorderColor = color;
    line.pointBackgroundColor = color;
  }

  getColor(dataset: Dataset): string | undefined {
    const color = dataset.borderColor;
    if (typeof color === 'string') {
      return color;
    }
    return undefined;
  }
}
