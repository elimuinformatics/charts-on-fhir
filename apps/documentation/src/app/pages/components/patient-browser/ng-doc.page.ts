import { NgDocPage } from '@ng-doc/core';
import ComponentsCategory from '../ng-doc.category';
import { PatientBrowserDemoComponent } from './demo/patient-browser-demo.component';

const PatientBrowser: NgDocPage = {
  title: 'Patient Browser',
  keyword: 'PatientBrowser',
  category: ComponentsCategory,
  mdFile: './index.md',
  imports: [],
  demos: { PatientBrowserDemoComponent },
};

export default PatientBrowser;
