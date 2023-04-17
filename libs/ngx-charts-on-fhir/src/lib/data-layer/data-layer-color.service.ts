import { Inject, Injectable, InjectionToken } from '@angular/core';
import { DataLayer, Dataset } from './data-layer';
import tinycolor from 'tinycolor2';
import { BoxAnnotationOptions } from 'chartjs-plugin-annotation';
import { HOME_DATASET_LABEL_SUFFIX } from '../fhir-chart-summary/home-measurement-summary.service';

/**
 * Injection Token used by `DataLayerColorService` to define the available chart colors.
 *
 * @usageNotes
 * Each application should define its color palette in the AppModule providers array:
 * ```ts
 * // app.module.ts
 * @NgModule({
 *   providers: [
 *     { provide: COLOR_PALETTE, useValue: ['#e36667', '#377eb8', '#4daf4a', '#984ea3'] },
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
export const COLOR_PALETTE = new InjectionToken<string[]>('Color Palette');

@Injectable({
  providedIn: 'root',
})
export class DataLayerColorService {
  /**
   * @param palette see `COLOR_PALETTE`
   */
  constructor(@Inject(COLOR_PALETTE) private readonly palette: string[]) {}

  private lightPalette = this.palette.map((c) => tinycolor(c).brighten(20).toString());
  private nextColorIndex = 0;

  /** Reset the service to its initial state so `chooseColorsFromPalette` will select the first color in the palette */
  reset() {
    this.nextColorIndex = 0;
  }

  /** Chooses colors for all of the datasets and annotations in the Layer by cycling through the palette */
  chooseColorsFromPalette(layer: DataLayer): void {
    for (let dataset of layer.datasets) {
      if (!this.getColor(dataset)) {
        const colorIndex = this.getMatchingDatasetColorIndex(layer, dataset) ?? this.getNextPaletteIndex();
        const palette = this.getPalette(dataset);
        const color = palette[colorIndex];
        this.setColor(dataset, color);
        this.setMatchingAnnotationColor(layer, dataset);
      }
    }
  }

  private getNextPaletteIndex() {
    const currentIndex = this.nextColorIndex;
    this.nextColorIndex = (this.nextColorIndex + 1) % this.palette.length;
    return currentIndex;
  }

  /** Gets the palette that should be used for the given dataset */
  private getPalette(dataset: Dataset) {
    if (dataset.label?.endsWith(HOME_DATASET_LABEL_SUFFIX)) {
      return this.lightPalette;
    }
    return this.palette;
  }

  /** Finds a matching dataset with similar label and returns its color index in the palette */
  private getMatchingDatasetColorIndex(layer: DataLayer, dataset: Dataset) {
    for (let other of layer.datasets) {
      if (isMatchingDataset(dataset, other)) {
        const color = this.getColor(other);
        if (color) {
          for (let palette of [this.palette, this.lightPalette]) {
            const index = palette.indexOf(color);
            if (index >= 0) {
              return index;
            }
          }
        }
      }
    }
    return null;
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

  addTransparency(color: string | undefined): string | undefined {
    const newcolor = tinycolor(color);
    newcolor.setAlpha(0.2);
    return newcolor.toString();
  }

  /**
   * Sets the border and background color of all chart elements in the given dataset (point, line, bar, etc.).
   * Transparency will be applied to the point background color if the dataset defines the custom property `chartsOnFhir.backgroundStyle = 'transparent'`
   */
  setColor(dataset: Dataset, color: string): void {
    const line = dataset as Dataset<'line'>;
    line.borderColor = color;
    line.backgroundColor = this.addTransparency(color);
    line.pointBorderColor = color;
    line.pointBackgroundColor = dataset.chartsOnFhir?.backgroundStyle === 'transparent' ? this.addTransparency(color) : color;
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

/** Determine whether two datasets "match" and should use similar colors */
function isMatchingDataset(dataset: Dataset, other: Dataset) {
  return other !== dataset && dataset.label && other.label && (dataset.label.startsWith(other.label) || other.label.startsWith(dataset.label));
}
