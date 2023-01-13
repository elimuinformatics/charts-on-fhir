import { CategoryScale, CategoryScaleOptions } from "chart.js";

/** Use declaration merging to add a scale type to the type registry */
declare module 'chart.js' {
  export interface CartesianScaleTypeRegistry {
    medication: {
      options: CategoryScaleOptions;
    };
  }
}

/** Medication scale adds extra padding to account for the wide lines and label offset */
export class MedicationScale extends CategoryScale {
  static override id = 'medication';
  override getPixelForValue(value: any, index?: number | undefined): number {
    const extraPadding = 30;
    const pixel = super.getPixelForValue(value, index);
    const shrink = (this.height - extraPadding) / this.height;
    return (pixel - this.top) * shrink + this.top + extraPadding;
  }
}

