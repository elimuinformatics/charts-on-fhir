import { InjectionToken } from '@angular/core';
import { ScaleOptions } from 'chart.js';
import { ChartAnnotation } from '../utils';

// can we use Chart.js built-in system for defaults and config merging instead?

export const TIME_SCALE_OPTIONS = new InjectionToken<ScaleOptions<'time'>>('Time scale options', {
  factory: () => defaultTimeScaleOptions,
});
export const defaultTimeScaleOptions: ScaleOptions<'time'> = {
  position: 'bottom',
  type: 'time',
  offset: true,
  stacked: false,
} as const;

export const LINEAR_SCALE_OPTIONS = new InjectionToken<ScaleOptions<'linear'>>('Linear scale options', {
  factory: () => defaultLinearScaleOptions,
});
export const defaultLinearScaleOptions: ScaleOptions<'linear'> = {
  display: 'auto',
  position: 'left',
  type: 'linear',
  stack: 'all',
  title: {
    display: true,
  },
} as const;

export const CATEGORY_SCALE_OPTIONS = new InjectionToken<ScaleOptions<'category'>>('Category scale options', {
  factory: () => defaultCategoryScaleOptions,
});
export const defaultCategoryScaleOptions: ScaleOptions<'category'> = {
  display: 'auto',
  position: 'left',
  type: 'category',
  offset: true,
  stack: 'all',
  stackWeight: 0.7,
  title: {
    display: true,
  },
  ticks: {
    display: false,
  },
} as const;

export const ANNOTATION_OPTIONS = new InjectionToken<ChartAnnotation>('Annotation Options', {
  factory: () => defaultAnnotationOptions,
});
export const defaultAnnotationOptions: ChartAnnotation = {
  label: {
    display: true,
    position: {
      x: 'start',
      y: 'end',
    },
    color: '#666666',
    font: {
      size: 16,
      weight: 'normal',
    },
  },
  type: 'box',
  backgroundColor: '#ECF0F9',
  borderWidth: 0,
  drawTime: 'beforeDraw',
};

export const LINE_ANNOTATION_OPTIONS = new InjectionToken<ChartAnnotation>('Line Annotation Options', {
  factory: () => defaultLineAnnotationOptions,
});
export const defaultLineAnnotationOptions: ChartAnnotation = {
  label: {
    display: true,
    position: 'start',
    color: '#666666',
    backgroundColor: '#FAFAFA',
    font: {
      size: 16,
      weight: 'normal',
    },
  },
  type: 'line',
  borderWidth: 4,
  borderColor: '#FF9999',
  drawTime: 'beforeDraw',
};

export const TIMEFRAME_ANNOTATION_OPTIONS = new InjectionToken<ChartAnnotation>('Timeframe annotation Options', {
  factory: () => defaultTimeframeAnnotationOptions,
});
export const defaultTimeframeAnnotationOptions: ChartAnnotation = {
  type: 'line',
  borderColor: '#FF900D',
  borderWidth: 3,
  display: true,
  drawTime: 'afterDatasetsDraw',
  label: {
    display: true,
    content: 'Today',
    position: 'start',
    color: '#FF900D',
    backgroundColor: '#FAFAFA',
  },
  scaleID: 'x',
  value: new Date().getTime(),
};
