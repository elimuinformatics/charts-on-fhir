import { ChartDataset, ChartType, ScaleOptions } from 'chart.js';
import { ChartAnnotations } from '../utils';

/** Timeline only supports Chart Types that have a Y-axis */
export type TimelineChartType = 'line' | 'bar' | 'scatter' | 'radar';

export type TimelineDataPoint = {
  x: number | [number, number];
  y: number | string;
};

export type TimelineScaleType = 'linear' | 'category' | 'medication';

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
    /**
     * When set to `transparent`, `DataLayerColorService` will apply partial transparency to the fill color of chart elements.
     * When set to `solid` (default), the same color will be used for both stroke and fill colors.
     */
    backgroundStyle?: 'solid' | 'transparent';
  };
};

/** A `DataLayer` with additional state controlled by a `DataLayerManagerService` */
export type ManagedDataLayer = DataLayer & {
  id: string;
  selected?: boolean;
  enabled?: boolean;
};

export type DataLayerCollection = { [id: string]: ManagedDataLayer };
