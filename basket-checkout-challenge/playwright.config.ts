import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright e2e configuration.
 *
 * The app is fully client-side (in-memory basket store, static public/products.json),
 * so no backend is required — Playwright just starts the Angular dev server.
 * All artifacts are written under e2e/test-output/, which is gitignored.
 */
export default defineConfig({
  testDir: './e2e',
  outputDir: 'e2e/test-output/results',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  reporter: [['list'], ['html', { outputFolder: 'e2e/test-output/report', open: 'never' }]],
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
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },
});
