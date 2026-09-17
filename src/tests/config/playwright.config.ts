import { defineConfig, devices } from '@playwright/test'
import path from 'node:path'

// A dedicated port keeps this from colliding with any other Next.js app
// already running on the default :3000 during local development.
const port = 3100
const baseURL = `http://localhost:${port}`

// The webServer command runs Next.js CLI scripts, which need the project
// root (this config file lives in src/tests/config) as their cwd.
const projectRoot = path.resolve(__dirname, '../../..')

export default defineConfig({
  testDir: '../e2e',
  // Default outputDir/reporter paths resolve against process.cwd(), not this
  // config file's location, so pin them under src/tests/e2e explicitly.
  outputDir: path.join(__dirname, '../e2e/test-results'),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    [
      'html',
      { outputFolder: path.join(__dirname, '../e2e/playwright-report') },
    ],
  ],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'pnpm build && pnpm start',
    cwd: projectRoot,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    env: { PORT: String(port) },
  },
})
