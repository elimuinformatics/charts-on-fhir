import { NgDocApi } from '@ng-doc/core';

const Api: NgDocApi = {
  title: 'API',
  scopes: [
    {
      name: 'ngx-charts-on-fhir',
      route: 'ngx-charts-on-fhir',
      include: 'libs/ngx-charts-on-fhir/src/index.ts',
    },
    // {
    //   name: 'chart.js',
    //   route: 'chart-js',
    //   include: 'node_modules/chart.js/types/*.ts',
    //   order: 2
    // },
  ],
};

export default Api;
