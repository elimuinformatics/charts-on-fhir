import { NgDocPage } from '@ng-doc/core';
import ComponentsCategory from '../ng-doc.category';
import { ChartSummaryDemoComponent } from './demo/chart-summary-demo.component';

const ChartSummary: NgDocPage = {
  title: 'Chart Summary',
  category: ComponentsCategory,
  mdFile: './index.md',
  imports: [],
  demos: { ChartSummaryDemoComponent },
};

export default ChartSummary;
