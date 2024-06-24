import { NgDocPage } from '@ng-doc/core';
import ComponentsCategory from '../ng-doc.category';
import { ChartDemoComponent } from './demos/chart/chart-demo.component';
import { FloatingContentDemoComponent } from './demos/floating-content/floating-content-demo.component';

const Chart: NgDocPage = {
  title: 'Chart',
  keyword: 'Chart',
  category: ComponentsCategory,
  mdFile: './index.md',
  imports: [],
  demos: { ChartDemoComponent, FloatingContentDemoComponent },
};

export default Chart;
