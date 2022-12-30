import { InjectionToken } from '@angular/core';
import { ScaleOptions } from 'chart.js';
import { ChartAnnotation } from '../utils';

// can we use Chart.js built-in system for defaults and config merging instead?

export const TIME_SCALE_OPTIONS = new InjectionToken<ScaleOptions<'time'>>('Time scale options', {
  factory: () => defaultTimeScaleOptions,
});
const defaultTimeScaleOptions: ScaleOptions<'time'> = {
  position: 'bottom',
  type: 'time',
  // time: {
  //   unit: 'day',
  //   displayFormats: {
  //     day: 'd MMM yyyy',
  //   },
  // },
} as const;

export const LINEAR_SCALE_OPTIONS = new InjectionToken<ScaleOptions<'linear'>>('Linear scale options', {
  factory: () => defaultLinearScaleOptions,
});
const defaultLinearScaleOptions: ScaleOptions<'linear'> = {
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
const defaultCategoryScaleOptions: ScaleOptions<'category'> = {
  display: 'auto',
  position: 'left',
  type: 'category',
  offset: true,
  stack: 'all',
  title: {
    display: true,
  },
  ticks: {
    autoSkip: false,
  },
} as const;

export const ANNOTATION_OPTIONS = new InjectionToken<ChartAnnotation>('Annotation Options', {
  factory: () => defaultAnnotationOptions,
});
const defaultAnnotationOptions: ChartAnnotation = {
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
