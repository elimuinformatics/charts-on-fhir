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
  offset: true,
  stacked: true,
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

export const MEDICATION_SCALE_OPTIONS = new InjectionToken<ScaleOptions<'category'>>('Medication scale options', {
  factory: () => defaultMedicationScaleOptions,
});
const defaultMedicationScaleOptions: ScaleOptions<'category'> = {
  display: 'auto',
  position: 'left',
  type: 'category',
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

export const TODAY_DATE_VERTICAL_LINE_ANNOTATION = new InjectionToken<ChartAnnotation>('Annotation Options', {
  factory: () => todayDateVerticalLineAnnotation,
});
const todayDateVerticalLineAnnotation: ChartAnnotation = {
  type: 'line',
  borderColor: '#FF900D',
  borderWidth: 3,
  display: true,
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
