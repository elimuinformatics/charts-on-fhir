import { NgDocDependencies } from '@ng-doc/core';
import { ChartDemoComponent } from './demo/chart-demo.component';
import { ChartDemoModule } from './ng-doc.module';

const PageDependencies: NgDocDependencies = {
  // Add your demos that you are going to use in the page here
  module: ChartDemoModule,
  demo: { ChartDemoComponent },
};

export default PageDependencies;
