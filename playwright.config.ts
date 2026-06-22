import { defineConfig, devices } from '@playwright/test'
import path from 'path'

const baseURL = process.env.BASE_URL ?? 'http://localhost:8081'

const AUTH_DIR = path.resolve(__dirname, 'e2e/.auth')
const HOST_AUTH = path.join(AUTH_DIR, 'host.json')

// Note: most specs use host@ as their primary actor. We default the `web` project
// to the host.json storageState. Specs that need a different actor (cohost, guest)
// can override via test.use({ storageState: ... }) inline.
// global-setup.ts creates host.json/cohost.json/guest.json — if any is missing
// (e.g., fresh checkout, backend down), the helpers fall back to UI login.

export default defineConfig({
  globalSetup: './e2e/global-setup.ts',
  timeout: 60000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 6,
  reporter: 'html',
  expect: {
    timeout: 15000,
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'web',
      testDir: './e2e/web',
      use: {
        ...devices['Desktop Chrome'],
        // Pre-authenticated as host@justhestia.app by global-setup.
        // Tests that need a different user override per-spec via test.use({...}).
        storageState: HOST_AUTH,
      },
    },
    {
      name: 'mobile',
      testDir: './e2e/mobile',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        storageState: HOST_AUTH,
      },
    },
  ],

  ...(process.env.BASE_URL
    ? {}
    : {
        webServer: {
          command:
            'mkdir -p node_modules/.cache/nativewind && npx tailwindcss -i global.css -o node_modules/.cache/nativewind/global.css.web.css --minify && npm run web',
          url: 'http://localhost:8081',
          reuseExistingServer: !process.env.CI,
          timeout: 120000,
        },
      }),
})
