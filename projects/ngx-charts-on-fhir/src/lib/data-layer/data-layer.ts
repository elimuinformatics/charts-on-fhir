import { ChartDataset, ChartType, ScaleChartOptions } from 'chart.js';
import { _DeepPartialObject, _DeepPartialArray, DeepPartial } from 'chart.js/types/utils';
import { ChartAnnotations } from '../utils';

/** Timeline only supports Chart Types that have a Y-axis */
export type TimelineChartType = 'line' | 'bar' | 'scatter' | 'radar';

export type TimelineDataPoint = {
  x: number;
  y: number | string;
};

/** A collection of closely-related data, metadata, and annotations */
export type DataLayer<T extends ChartType = TimelineChartType, D = TimelineDataPoint[]> = {
  name: string;
  category?: string;
  scales: DeepPartial<ScaleChartOptions<T>>['scales'];
  datasets: ChartDataset<T, D>[];
  annotations?: ChartAnnotations;
};

export type Dataset<T extends ChartType = TimelineChartType, D = TimelineDataPoint[]> = ChartDataset<T, D>;

/** A [DataLayer] with additional state controlled by a DataLayerManager */
export type ManagedDataLayer = DataLayer & {
  id: string;
  selected?: boolean;
  enabled?: boolean;
};

export type DataLayerCollection = { [id: string]: ManagedDataLayer };
