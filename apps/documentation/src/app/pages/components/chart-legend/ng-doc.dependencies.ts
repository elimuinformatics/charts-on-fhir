import { NgDocDependencies } from '@ng-doc/core';
import { ChartLegendDemoModule } from './ng-doc.module';
import { ChartLegendDemoComponent } from './demos/legend/chart-legend-demo.component';
import { ChartTagsLegendDemoComponent } from './demos/tags-legend/chart-tags-legend-demo.component';

const PageDependencies: NgDocDependencies = {
  module: ChartLegendDemoModule,
  // Add your demos that you are going to use in the page here
  demo: { ChartLegendDemoComponent, ChartTagsLegendDemoComponent },
};

export default PageDependencies;
