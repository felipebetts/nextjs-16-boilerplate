import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

const dirname = fileURLToPath(new URL('.', import.meta.url))
// This config lives in src/tests/config, but test files live one level up,
// in src/tests/unit.
const testsRoot = path.resolve(dirname, '..')

export default defineConfig({
  // Keep Vite's dependency cache in the project's own node_modules instead
  // of it defaulting to <root>/node_modules, which would create one inside
  // src/tests since `root` is pointed there below.
  cacheDir: path.resolve(dirname, '../../../node_modules/.vite'),
  plugins: [tsconfigPaths(), react()],
  test: {
    root: testsRoot,
    environment: 'jsdom',
    include: ['unit/**/*.test.{ts,tsx}'],
    setupFiles: [path.resolve(dirname, './vitest.setup.ts')],
  },
})
