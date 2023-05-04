import { NgDocDependencies } from '@ng-doc/core';
import { SummaryRangeSelectorDemoComponent } from './demo/summary-range-selector-demo.component';
import { SummaryRangeSelectorDemoModule } from './ng-doc.module';

const PageDependencies: NgDocDependencies = {
  // Add your demos that you are going to use in the page here
  module: SummaryRangeSelectorDemoModule,
  demo: { SummaryRangeSelectorDemoComponent },
};

export default PageDependencies;
