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

echo ::::: Creating a new Angular app with Angular $MIN_ANGULAR_VERSION
npx --yes \@angular/cli@${MIN_ANGULAR_VERSION} new test-app --defaults --package-manager=npm
cd test-app

# Get the actual Angular version that was installed
INSTALLED_ANGULAR_VERSION=$(jq -r '.dependencies."@angular/core"' package.json | sed 's/\^//')
echo "Angular version installed: $INSTALLED_ANGULAR_VERSION"

echo ::::: Installing Angular Material compatible with Angular $INSTALLED_ANGULAR_VERSION
npm install @angular/material@20.2.14 @angular/cdk@20.2.14

echo ::::: Pinning all Angular dependencies to version 20.x
npm install @angular/core@20.3.15 @angular/common@20.3.15 @angular/platform-browser@20.3.15 @angular/platform-browser-dynamic@20.3.15 @angular/forms@20.3.15 @angular/router@20.3.15

echo ::::: Installing Charts-on-FHIR library
npm i ../dist/libs/ngx-charts-on-fhir/${PACKAGE_FILE}

echo ::::: Building the Angular app
npx ng build

echo ::::: Success
