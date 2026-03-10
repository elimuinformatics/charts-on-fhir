# This script tests the NPM package to make sure it can be installed in a new Angular application without any dependency conflicts.
# It expects to be run from the workspace root, which is the default working dir for nx commands.
# It assumes that the library has already been built before running this script.

set -e

# Set versions explicitly for testing
MIN_ANGULAR_VERSION="20.3.15"
MIN_ANGULAR_CLI_VERSION="20.3.13"
MIN_MATERIAL_VERSION="20.2.14"
echo Using Angular CLI $MIN_ANGULAR_CLI_VERSION

echo :::: Packaging Charts-on-FHIR library
cd dist/libs/ngx-charts-on-fhir
PACKAGE_FILE=$(npm pack)
cd ../../..

echo ::::: Creating a new Angular app with Angular $MIN_ANGULAR_CLI_VERSION
npx --yes \@angular/cli@${MIN_ANGULAR_CLI_VERSION} new test-app --defaults --package-manager=npm
cd test-app

# Get the actual Angular version that was installed
INSTALLED_ANGULAR_VERSION=$(jq -r '.version' node_modules/@angular/core/package.json)
echo "Angular version installed: $INSTALLED_ANGULAR_VERSION"

echo ::::: Installing Angular Material compatible with Angular $MIN_ANGULAR_VERSION
npm install @angular/material@${MIN_MATERIAL_VERSION} @angular/cdk@${MIN_MATERIAL_VERSION}

echo ::::: Pinning all Angular dependencies to version $INSTALLED_ANGULAR_VERSION
npm install @angular/core@${INSTALLED_ANGULAR_VERSION} @angular/common@${INSTALLED_ANGULAR_VERSION} @angular/platform-browser@${INSTALLED_ANGULAR_VERSION} @angular/platform-browser-dynamic@${INSTALLED_ANGULAR_VERSION} @angular/forms@${INSTALLED_ANGULAR_VERSION} @angular/router@${INSTALLED_ANGULAR_VERSION}

echo ::::: Installing Charts-on-FHIR library
npm i ../dist/libs/ngx-charts-on-fhir/${PACKAGE_FILE}

echo ::::: Building the Angular app
npx ng build

echo ::::: Success