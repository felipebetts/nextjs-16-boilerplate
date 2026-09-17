import { expect, test } from '@playwright/test'

test('home page renders the getting started heading', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'To get started, edit the',
  )
})
