import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  timeout: 45_000,
  globalTimeout: 10 * 60_000,
  workers: 2,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:4321', trace: 'retain-on-failure' },
  webServer: {
    command: 'pnpm exec astro preview --host 127.0.0.1 --port 4321',
    url:
      'http://127.0.0.1:4321' +
      (process.env.PAGES_PREVIEW === 'true' ? '/drvasundara/' : '/'),
    reuseExistingServer: false,
  },
  projects: [375, 768, 1440].map((width) => ({
    name: `${width}px`,
    use: { browserName: 'chromium', viewport: { width, height: 900 } },
  })),
});
