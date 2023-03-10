import { NgDocDependencies } from '@ng-doc/core';
import { ChartSummaryDemoComponent } from './demo/chart-summary-demo.component';
import { ChartSummaryDemoModule } from './ng-doc.module';

const PageDependencies: NgDocDependencies = {
  // Add your demos that you are going to use in the page here
  module: ChartSummaryDemoModule,
  demo: { ChartSummaryDemoComponent },
};

export default PageDependencies;
