import { test, expect } from '@playwright/test';
import { ShowcasePage } from './pages/showcase.page';
import patientBundle from './fixtures/patient-bundle.json';
import observationBundle from './fixtures/observation-bundle.json';
import emptyBundle from './fixtures/empty-bundle.json';

const FHIR_BASE = 'http://localhost:3000';

/**
 * Registers Playwright route interceptors for the FHIR endpoints used by the
 * showcase app (Observation, Encounter, MedicationRequest).  The patient list
 * endpoint is kept separate so individual tests can override it.
 */
async function mockFhirDataEndpoints(page: import('@playwright/test').Page, observationResponse = observationBundle) {
  await page.route(`${FHIR_BASE}/Observation**`, (route) => route.fulfill({ json: observationResponse }));
  await page.route(`${FHIR_BASE}/Encounter**`, (route) => route.fulfill({ json: emptyBundle }));
  await page.route(`${FHIR_BASE}/MedicationRequest**`, (route) => route.fulfill({ json: emptyBundle }));
}

test.describe('Showcase app', () => {
  let showcase: ShowcasePage;

  test.beforeEach(async ({ page }) => {
    showcase = new ShowcasePage(page);
  });

  test.describe('initial load', () => {
    test('should load the application and show the layout', async ({ page }) => {
      await page.route(`${FHIR_BASE}/Patient**`, (route) => route.fulfill({ json: patientBundle }));
      await mockFhirDataEndpoints(page);

      await showcase.goto();

      await expect(page).toHaveTitle(/Charts-on-FHIR/);
      await expect(showcase.toolbarBrowser).toBeVisible();
      await expect(showcase.toolbarOptions).toBeVisible();
    });

    test('should show the patient list on initial load', async ({ page }) => {
      await page.route(`${FHIR_BASE}/Patient**`, (route) => route.fulfill({ json: patientBundle }));
      await mockFhirDataEndpoints(page);

      await showcase.goto();

      await expect(showcase.patientTable).toBeVisible();
      await expect(showcase.patientRows).toHaveCount(1);
    });

    test('should show empty state when patient list is empty', async ({ page }) => {
      await page.route(`${FHIR_BASE}/Patient**`, (route) => route.fulfill({ json: emptyBundle }));
      await mockFhirDataEndpoints(page);

      await showcase.goto();

      await expect(showcase.patientTable).toBeVisible();
      await expect(showcase.patientRows).toHaveCount(0);
    });
  });

  test.describe('selecting a patient', () => {
    test.beforeEach(async ({ page }) => {
      await page.route(`${FHIR_BASE}/Patient**`, (route) => route.fulfill({ json: patientBundle }));
      await mockFhirDataEndpoints(page);
      await showcase.goto();
    });

    test('should open the data layer browser after selecting a patient', async () => {
      await showcase.selectFirstPatient();
      await showcase.openLayerBrowser();

      await expect(showcase.layerBrowserTable).toBeVisible();
    });

    test('should display available data layers after selecting a patient', async () => {
      await showcase.selectFirstPatient();
      await showcase.openLayerBrowser();

      await expect(showcase.layerRows).not.toHaveCount(0);
    });
  });

  test.describe('data layer browser', () => {
    test.beforeEach(async ({ page }) => {
      await page.route(`${FHIR_BASE}/Patient**`, (route) => route.fulfill({ json: patientBundle }));
      await mockFhirDataEndpoints(page);
      await showcase.goto();
      await showcase.selectFirstPatient();
      await showcase.openLayerBrowser();
    });

    test('should show the layer search input', async () => {
      await expect(showcase.layerSearch).toBeVisible();
    });

    test('should filter layers by search text', async () => {
      const allRowCount = await showcase.layerRows.count();

      await showcase.layerSearch.fill('nonexistent-xyz');

      // After filtering with a non-matching term, fewer rows should appear
      const filteredRowCount = await showcase.layerRows.count();
      expect(filteredRowCount).toBeLessThan(allRowCount);
    });
  });

  test.describe('chart rendering', () => {
    test.beforeEach(async ({ page }) => {
      await page.route(`${FHIR_BASE}/Patient**`, (route) => route.fulfill({ json: patientBundle }));
      await mockFhirDataEndpoints(page);
      await showcase.goto();
      await showcase.selectFirstPatient();
      await showcase.openLayerBrowser();
    });

    test('should show empty message before any data layer is added', async () => {
      await expect(showcase.chartEmpty).toBeVisible();
    });

    test('should render the chart canvas after adding a data layer', async () => {
      await showcase.addFirstLayer();

      await expect(showcase.chartCanvas).toBeVisible();
    });

    test('should hide the empty message after a data layer is added', async () => {
      await showcase.addFirstLayer();

      await expect(showcase.chartEmpty).not.toBeVisible();
    });
  });

  test.describe('empty data', () => {
    test('should show no-layers message when FHIR server returns no observations', async ({ page }) => {
      await page.route(`${FHIR_BASE}/Patient**`, (route) => route.fulfill({ json: patientBundle }));
      await mockFhirDataEndpoints(page, emptyBundle);
      await showcase.goto();
      await showcase.selectFirstPatient();
      await showcase.openLayerBrowser();

      await expect(showcase.noLayersMessage).toBeVisible();
    });
  });

  test.describe('error handling', () => {
    test('should not crash when FHIR server returns 500 for observations', async ({ page }) => {
      await page.route(`${FHIR_BASE}/Patient**`, (route) => route.fulfill({ json: patientBundle }));
      await page.route(`${FHIR_BASE}/Observation**`, (route) => route.fulfill({ status: 500 }));
      await page.route(`${FHIR_BASE}/Encounter**`, (route) => route.fulfill({ json: emptyBundle }));
      await page.route(`${FHIR_BASE}/MedicationRequest**`, (route) => route.fulfill({ json: emptyBundle }));

      await showcase.goto();
      await showcase.selectFirstPatient();

      // App should still be functional (patient browser visible, no uncaught crash)
      await expect(showcase.toolbarBrowser).toBeVisible();
    });
  });
});
