# This script tests the NPM package to make sure it can be installed in a new Angular application without any dependency conflicts.
# It expects to be run from the workspace root, which is the default working dir for nx commands.
# It assumes that the library has already been built before running this script.

set -e

ANGULAR_CLI_VERSION="${ANGULAR_CLI_VERSION:-latest}"
echo Using Angular CLI $ANGULAR_CLI_VERSION

echo :::: Packaging Charts-on-FHIR library
cd dist/libs/ngx-charts-on-fhir
PACKAGE_FILE=$(npm pack)
cd ../../..

echo ::::: Creating a new Angular app with Angular CLI $ANGULAR_CLI_VERSION
npx --yes \@angular/cli@${ANGULAR_CLI_VERSION} new test-app --defaults --package-manager=npm
cd test-app

INSTALLED_ANGULAR_VERSION=$(jq -r '.dependencies."@angular/core"' package.json | sed 's/^\^//')
echo "Angular version installed: $INSTALLED_ANGULAR_VERSION"

echo "::::: Installing Charts-on-FHIR library (auto-installing peer dependencies)"
npm install --save-exact --install-strategy=peer ../dist/libs/ngx-charts-on-fhir/${PACKAGE_FILE}

echo ::::: Building the Angular app
npx ng build

echo ::::: Success
