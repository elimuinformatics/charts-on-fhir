import { NgDocDependencies } from '@ng-doc/core';
import { ChartDemoComponent } from './demos/chart/chart-demo.component';
import { FloatingContentDemoComponent } from './demos/floating-content/floating-content-demo.component';
import { ChartDemoModule } from './ng-doc.module';

const PageDependencies: NgDocDependencies = {
  // Add your demos that you are going to use in the page here
  module: ChartDemoModule,
  demo: { ChartDemoComponent, FloatingContentDemoComponent },
};

export default PageDependencies;
