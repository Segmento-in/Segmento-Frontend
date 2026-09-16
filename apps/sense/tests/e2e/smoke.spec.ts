import { test, expect } from '@playwright/test';

test('Smoke test: /model-lab/connectors renders', async ({ page }) => {
  await page.goto('/sense/model-lab/connectors');
  
  await expect(page.getByText('Select a Connector').or(page.getByText('Sign in or create a new Sense account'))).toBeVisible({ timeout: 60000 });
});
