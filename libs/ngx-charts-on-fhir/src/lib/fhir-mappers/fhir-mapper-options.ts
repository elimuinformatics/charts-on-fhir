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

export const MEDICATION_SCALE_OPTIONS = new InjectionToken<ScaleOptions<'medication'>>('Medication scale options', {
  factory: () => defaultMedicationScaleOptions,
});
const defaultMedicationScaleOptions: ScaleOptions<'medication'> = {
  display: 'auto',
  position: 'left',
  type: 'medication',
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
