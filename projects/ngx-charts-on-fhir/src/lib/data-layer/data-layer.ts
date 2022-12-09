import { ChartDataset, ScatterDataPoint, ChartType, ScaleChartOptions } from 'chart.js';
import { DeepPartial } from 'chart.js/types/utils';
import { ChartAnnotations } from '../utils';

/** Timeline only supports Chart Types that have a Y-axis */
export type TimelineChartType = 'line' | 'bar' | 'scatter' | 'radar';

/** A collection of closely-related data, metadata, and annotations */
export type DataLayer<T extends ChartType = TimelineChartType, D = ScatterDataPoint[]> = {
  name: string;
  category?: string;
  scales: DeepPartial<ScaleChartOptions<T>>['scales'];
  datasets: ChartDataset<T, D>[];
  annotations?: ChartAnnotations;
};

export type Dataset<T extends ChartType = TimelineChartType, D = ScatterDataPoint[]> = ChartDataset<T, D>;

/** A [DataLayer] with additional state controlled by a DataLayerManager */
export type ManagedDataLayer = DataLayer & {
  id: string;
  selected?: boolean;
  enabled?: boolean;
};

export type DataLayerCollection = { [id: string]: ManagedDataLayer };
