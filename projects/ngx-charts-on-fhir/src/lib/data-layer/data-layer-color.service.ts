import { Inject, Injectable, InjectionToken } from '@angular/core';
import { DataLayer, Dataset } from './data-layer';
import tinycolor from 'tinycolor2';
import { BoxAnnotationOptions } from 'chartjs-plugin-annotation';

export const COLOR_PALETTE = new InjectionToken<string[]>('Color Palette');

@Injectable({
  providedIn: 'root',
})
export class DataLayerColorService {
  constructor(@Inject(COLOR_PALETTE) private readonly palette: string[]) {}

  private nextColorIndex = 0;

  reset() {
    this.nextColorIndex = 0;
  }

  chooseColorsFromPalette(layer: DataLayer): void {
    for (let dataset of layer.datasets) {
      if (!this.getColor(dataset)) {
        const color = this.palette[this.nextColorIndex];
        this.nextColorIndex = (this.nextColorIndex + 1) % this.palette.length;
        this.setColor(dataset, color);
        this.setMatchingAnnotationColor(layer, dataset);
        this.setMatchingDatasetColor(layer, dataset);
      }
    }
  }

  /** Finds the corresponding annotations for a dataset and changes their colors to match the dataset */
  private setMatchingAnnotationColor(layer: DataLayer, dataset: Dataset) {
    if (layer.annotations && dataset.label) {
      for (let annotation of layer.annotations) {
        const anno = annotation as BoxAnnotationOptions;
        const label = anno.label?.content;
        if (typeof label === 'string' && label.startsWith(dataset.label)) {
          anno.backgroundColor = this.addTransparency(this.getColor(dataset));
        }
      }
    }
  }

  /** Finds associated datasets and changes their colors to match the given dataset */
  private setMatchingDatasetColor(layer: DataLayer, dataset: Dataset) {
    if (dataset.label) {
      for (let other of layer.datasets) {
        if (other !== dataset && other.label?.startsWith(dataset.label)) {
          const color = tinycolor(this.getColor(dataset));
          this.setColor(other, color.brighten(20).toString());
        }
      }
    }
  }

  addTransparency(color: string | undefined): string | undefined {
    const newcolor = tinycolor(color);
    newcolor.setAlpha(0.2);
    return newcolor.toString();
  }

  setColor(dataset: Dataset, color: string): void {
    const line = dataset as Dataset<'line'>;
    line.borderColor = color;
    line.backgroundColor = this.addTransparency(color);
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

  /** build a CSS linear gradient that includes colors from all datasets in the layer */
  getColorGradient(layer: DataLayer) {
    const percent = (i: number) => Math.floor((100 * i) / layer.datasets.length);
    const colors = layer.name === 'Medications' ? layer.datasets.map(this.getColor).reverse() : layer.datasets.map(this.getColor);
    const segments = colors.map((color, i) => `${color} ${percent(i)}%, ${color} ${percent(i + 1)}%`);
    const gradient = `linear-gradient(0deg, ${segments.join(',')})`;
    return gradient;
  }
}
