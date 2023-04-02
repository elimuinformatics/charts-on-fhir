import { NgDocDependencies } from '@ng-doc/core';
import { PatientBrowserDemoModule } from './ng-doc.module';
import { PatientBrowserDemoComponent } from './demo/patient-browser-demo.component';

const PageDependencies: NgDocDependencies = {
  // Add your demos that you are going to use in the page here
  module: PatientBrowserDemoModule,
  demo: { PatientBrowserDemoComponent },
};

export default PageDependencies;
