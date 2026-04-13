import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for the Charts-on-FHIR Showcase application.
 * Centralises all selectors so that UI changes only require updates here.
 */
export class ShowcasePage {
  readonly page: Page;

  // Toolbar buttons
  readonly toolbarBrowser: Locator;
  readonly toolbarOptions: Locator;
  readonly toolbarPatients: Locator;

  // Patient browser
  readonly patientTable: Locator;
  readonly patientRows: Locator;
  readonly firstSelectPatientButton: Locator;

  // Data layer browser
  readonly layerBrowserTable: Locator;
  readonly layerRows: Locator;
  readonly firstAddLayerButton: Locator;
  readonly layerSearch: Locator;
  readonly noLayersMessage: Locator;

  // Chart area
  readonly chartCanvas: Locator;
  readonly chartEmpty: Locator;
  readonly chartLoading: Locator;
  readonly chartError: Locator;

  constructor(page: Page) {
    this.page = page;

    this.toolbarBrowser = page.locator('[data-testid="toolbar-browser"]');
    this.toolbarOptions = page.locator('[data-testid="toolbar-options"]');
    this.toolbarPatients = page.locator('[data-testid="toolbar-patients"]');

    this.patientTable = page.locator('[data-testid="patient-table"]');
    this.patientRows = page.locator('[data-testid="patient-table"] tr[mat-row]');
    this.firstSelectPatientButton = page.locator('[data-testid="select-patient-button"]').first();

    this.layerBrowserTable = page.locator('[data-testid="layer-browser-table"]');
    this.layerRows = page.locator('[data-testid="layer-browser-table"] tr[mat-row]');
    this.firstAddLayerButton = page.locator('[data-testid="add-layer-button"]').first();
    this.layerSearch = page.locator('[data-testid="layer-search"]');
    this.noLayersMessage = page.locator('[data-testid="no-layers-message"]');

    this.chartCanvas = page.locator('[data-testid="chart-canvas"]');
    this.chartEmpty = page.locator('[data-testid="chart-empty"]');
    this.chartLoading = page.locator('[data-testid="chart-loading"]');
    this.chartError = page.locator('[data-testid="chart-error"]');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  /** Open the patient list panel via the toolbar button. */
  async openPatientBrowser() {
    await this.toolbarPatients.click();
  }

  /** Open the data layer browser panel via the toolbar button. */
  async openLayerBrowser() {
    await this.toolbarBrowser.click();
  }

  /** Select the first patient in the patient list. */
  async selectFirstPatient() {
    await this.firstSelectPatientButton.click();
  }

  /** Add the first available data layer to the chart. */
  async addFirstLayer() {
    await this.firstAddLayerButton.click();
  }
}
