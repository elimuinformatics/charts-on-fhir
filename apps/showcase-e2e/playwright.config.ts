import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npx nx serve showcase --configuration=mock --port=4200',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
    timeout: 120000,
  },
});
