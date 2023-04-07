import { NgDocDependencies } from '@ng-doc/core';
import { FhirChartLayoutDemoModule } from './ng-doc.module';
import { ChartLayoutDemoComponent } from './demo/chart-layout-demo.component';

const PageDependencies: NgDocDependencies = {
  // Add your demos that you are going to use in the page here
  module: FhirChartLayoutDemoModule,
  demo: { ChartLayoutDemoComponent },
};

export default PageDependencies;
