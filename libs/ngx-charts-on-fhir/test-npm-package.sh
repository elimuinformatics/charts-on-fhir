# This script tests the NPM package to make sure it can be installed in a new Angular application without any dependency conflicts.
# It expects to be run from the workspace root, which is the default working dir for nx commands.
# It assumes that the library has already been built before running this script.

set -e

echo ::::: Extracting minimum required angular version from package.json
MIN_ANGULAR_VERSION=$(jq '.peerDependencies."@angular/core"' libs/ngx-charts-on-fhir/package.json | sed -E 's/">=(.*)"/\1/')
echo Using Angular CLI $MIN_ANGULAR_VERSION

echo :::: Packaging Charts-on-FHIR library
cd dist/libs/ngx-charts-on-fhir
PACKAGE_FILE=$(npm pack)
cd ../../..

echo ::::: Creating a new Angular app
npx --yes \@angular/cli@${MIN_ANGULAR_VERSION} new test-app --defaults
cd test-app

echo ::::: Installing Angular Material
npx --yes \@angular/cli@${MIN_ANGULAR_VERSION} add @angular/material --skip-confirmation --interactive=false

echo ::::: Installing Charts-on-FHIR library
npm i ../dist/libs/ngx-charts-on-fhir/${PACKAGE_FILE}

echo ::::: Building the Angular app
npx ng build

echo ::::: Success
