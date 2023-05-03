import { NgDocDependencies } from '@ng-doc/core';
import { TimelineRangeSelectorDemoComponent } from './demo/timeline-range-selector-demo.component';
import { TimelineRangeSelectorDemoModule } from './ng-doc.module';

const PageDependencies: NgDocDependencies = {
  // Add your demos that you are going to use in the page here
  module: TimelineRangeSelectorDemoModule,
  demo: { TimelineRangeSelectorDemoComponent },
};

export default PageDependencies;
