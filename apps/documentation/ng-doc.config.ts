import { NgDocConfiguration } from '@ng-doc/builder';

const NgDocConfig: NgDocConfiguration = {
  pages: 'apps/documentation/src/app/pages',
  repoConfig: {
    url: 'https://github.com/elimuinformatics/charts-on-fhir',
    mainBranch: 'main',
    releaseBranch: 'main',
  },
};

export default NgDocConfig;
