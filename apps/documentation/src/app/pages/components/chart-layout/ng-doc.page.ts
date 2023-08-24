import { NgDocPage } from '@ng-doc/core';
import ComponentsCategory from '../ng-doc.category';
import { FhirChartLayoutDemoModule } from './ng-doc.module';
import { ChartLayoutDemoComponent } from './demo/chart-layout-demo.component';

const ChartLayout: NgDocPage = {
  title: 'Chart Layout',
  keyword: 'ChartLayout',
  category: ComponentsCategory,
  mdFile: './index.md',
  imports: [FhirChartLayoutDemoModule],
  demos: { ChartLayoutDemoComponent },
};

export default ChartLayout;
