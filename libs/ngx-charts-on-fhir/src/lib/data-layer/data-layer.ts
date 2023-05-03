import { ChartDataset, ChartType, ScaleOptions } from 'chart.js';
import { ChartAnnotations } from '../utils';

/** Timeline only supports Chart Types that have a Y-axis */
export type TimelineChartType = 'line' | 'bar' | 'scatter' | 'radar';

export type TimelineDataPoint = {
  x: number | [number, number];
  y: number | string;
  tooltip?: string | string[];
};

export type TimelineScaleType = 'linear' | 'category';

/** A collection of closely-related data, metadata, and annotations */
export type DataLayer<T extends ChartType = TimelineChartType, D = TimelineDataPoint[]> = {
  name: string;
  category?: string[];
  scale: ScaleOptions & { id: string };
  datasets: Dataset<T, D>[];
  annotations?: ChartAnnotations;
};

/** Extends the Chart.js `ChartDataset` type with additional options that are used by Charts-on-FHIR Angular services */
export type Dataset<T extends ChartType = TimelineChartType, D = TimelineDataPoint[]> = ChartDataset<T, D> & {
  /** Custom chart options for Charts-on-FHIR */
  chartsOnFhir?: {
    /** Datasets in the same group will be assigned the same color and will be combined in statistical calculations */
    group?: string;
    /** When set to 'light', `DataLayerColorService` will use a lighter palette when choosing a color for this dataset. */
    colorPalette?: 'light' | 'dark';
    /**
     * When set to `transparent`, `DataLayerColorService` will apply partial transparency to the fill color of points.
     * When set to `solid` (default), the same color will be used for both stroke and fill colors.
     */
    backgroundStyle?: 'solid' | 'transparent';
    /** Tags can be used to apply similar visual style to multiple datasets */
    tags?: string[];
    /**
     * ID of the Reference Range Annotation for this dataset.
     * The annotation will be assigned a matching color and the Reference Range will be used in some statistical calculations.
     */
    referenceRangeAnnotation?: string;
  };
};

/** A `DataLayer` with additional state controlled by a `DataLayerManagerService` */
export type ManagedDataLayer = DataLayer & {
  id: string;
  selected?: boolean;
  enabled?: boolean;
};

export type DataLayerCollection = { [id: string]: ManagedDataLayer };
