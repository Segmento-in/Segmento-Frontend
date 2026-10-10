import { test, expect, type Request } from '@playwright/test';

const APP_ORIGIN = 'http://localhost:3002';
const TABLE = 'customers_e2e';

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'authorization,content-type',
  'access-control-allow-methods': 'GET,POST,OPTIONS',
};

const EMAILS = ['jane.secret@example.org', 'omar.hidden@example.org', 'li.private@example.org'];
const NOTE_EMAIL = 'sam.notes@example.org';
const NOTE_PHONE = '+1-555-010-0000';
const NOTE_PERSON = 'Priya Nair';
const SECRETS = [...EMAILS, NOTE_EMAIL, NOTE_PHONE, NOTE_PERSON];

type Span = { label: string; text: string; score: number };

// Offsets are always computed from the value, never counted by hand.
function cell(value: string, spans: Span[] = []) {
  return {
    value,
    findings: spans.map((s) => {
      const start = value.indexOf(s.text);
      if (start < 0) throw new Error(`fixture bug: "${s.text}" not found in "${value}"`);
      return { label: s.label, start, end: start + s.text.length, score: s.score };
    }),
  };
}

const PROJECTION = {
  scan_mode: 'sampling',
  row_cap: 5,
  displayed_rows: 3,
  columns: [
    { name: 'id', verdict: null, verdict_cells: 0, flagged_cells: 0, total_cells: 3 },
    { name: 'email', verdict: 'EMAIL_ADDRESS', verdict_cells: 3, flagged_cells: 3, total_cells: 3 },
    { name: 'notes', verdict: 'EMAIL_ADDRESS', verdict_cells: 1, flagged_cells: 3, total_cells: 3 },
  ],
  rows: [
    [
      cell('1'),
      cell(EMAILS[0], [{ label: 'EMAIL_ADDRESS', text: EMAILS[0], score: 0.95 }]),
      cell(`contact ${NOTE_EMAIL} today`, [{ label: 'EMAIL_ADDRESS', text: NOTE_EMAIL, score: 0.95 }]),
    ],
    [
      cell('2'),
      cell(EMAILS[1], [{ label: 'EMAIL_ADDRESS', text: EMAILS[1], score: 0.95 }]),
      cell(`call ${NOTE_PHONE} now`, [{ label: 'PHONE_NUMBER', text: NOTE_PHONE, score: 0.9 }]),
    ],
    [
      cell('3'),
      cell(EMAILS[2], [{ label: 'EMAIL_ADDRESS', text: EMAILS[2], score: 0.95 }]),
      cell(`met ${NOTE_PERSON}`, [{ label: 'PERSON', text: NOTE_PERSON, score: 0.8 }]),
    ],
  ],
};

const SCAN_RESPONSE = {
  pii_counts: [
    { 'PII Type': 'EMAIL_ADDRESS', Count: 4 },
    { 'PII Type': 'PHONE_NUMBER', Count: 1 },
    { 'PII Type': 'PERSON', Count: 1 },
  ],
  total_pii_found: 6,
  rows_scanned: 3,
  metadata: { scan_mode: 'sampling' },
  schema: [
    { Column: 'id', Type: 'integer' },
    { Column: 'email', Type: 'text' },
    { Column: 'notes', Type: 'text' },
  ],
};

test.describe('Postgres Table View full UI flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('sense_access_token', 'fake-e2e-token');
      window.localStorage.setItem(
        'sense_auth_user',
        JSON.stringify({
          id: '00000000-0000-4000-8000-000000000001',
          email: 'e2e@example.test',
          name: 'E2E User',
          created_at: '2026-01-01T00:00:00Z',
        }),
      );
    });
  });

  test('Postgres Table View: highlights, badges, Masked View', async ({ page }) => {
    test.setTimeout(120_000);

    const blocked: string[] = [];
    const projectionCalls: { auth: string | undefined; body: any }[] = [];

    // 1) Catch-all guard, registered FIRST. In Playwright the LATER route wins,
    //    so the specific mocks below take priority. Anything that is not the app
    //    itself and is a fetch, an xhr or a preflight is recorded and aborted.
    await page.route('**/*', async (route) => {
      const req = route.request();
      const isApp = req.url().startsWith(APP_ORIGIN);
      const isApiLike = req.resourceType() === 'fetch' || req.resourceType() === 'xhr' || req.method() === 'OPTIONS';
      if (!isApp && isApiLike) {
        blocked.push(`${req.method()} ${req.url()}`);
        return route.abort();
      }
      return route.continue();
    });

    // 2) Specific mocks. Matched by path on any non-app origin, so the backend
    //    host does not matter. A wrong method is recorded as blocked.
    const mock = async (
      pathname: string,
      method: 'GET' | 'POST',
      body: unknown,
      onRequest?: (req: Request) => void,
    ) => {
      await page.route(
        (url) => url.origin !== APP_ORIGIN && url.pathname === pathname,
        async (route) => {
          const req = route.request();
          if (req.method() === 'OPTIONS') {
            return route.fulfill({ status: 204, headers: CORS });
          }
          if (req.method() !== method) {
            blocked.push(`WRONG METHOD ${req.method()} ${req.url()}`);
            return route.abort();
          }
          onRequest?.(req);
          return route.fulfill({
            status: 200,
            headers: CORS,
            contentType: 'application/json',
            body: JSON.stringify(body),
          });
        },
      );
    };

    await mock('/api/connect/postgresql/list-tables', 'POST', { tables: [TABLE] });
    await mock('/db/catalog', 'GET', { files: [], last_session: null, sessions: [] });
    await mock('/api/auth/credits/deduct', 'POST', { success: true, credits_remaining: 99 });
    await mock('/api/connect/postgresql', 'POST', SCAN_RESPONSE);
    await mock('/api/projection/postgresql', 'POST', PROJECTION, (req) => {
      projectionCalls.push({ auth: req.headers()['authorization'], body: req.postDataJSON() });
    });

    // Step 1: open Connectors, PostgreSQL, fake credentials, connect, pick table, scan, analyze.
    await page.goto('/sense/model-lab/connectors');
    const card = page
      .locator('div')
      .filter({ hasText: /Relational Database/ })
      .filter({ has: page.getByRole('button', { name: 'View Connector' }) })
      .last();
    await card.getByRole('button', { name: 'View Connector' }).click({ timeout: 60_000 });

    await page.getByPlaceholder('localhost or 127.0.0.1').fill('fake-host.invalid');
    await page.getByPlaceholder('5432').fill('5432');
    await page.getByPlaceholder('my_database').fill('fake_db');
    await page.getByPlaceholder('db_user').fill('fake_user');
    await page.getByPlaceholder('\u2022'.repeat(8)).fill('fake-password');
    await page.getByRole('button', { name: 'Connect & List Tables' }).click();

    const row = page
      .locator('div,tr,li')
      .filter({ hasText: TABLE })
      .filter({ has: page.locator('input[type="checkbox"]') })
      .last();
    await row.locator('input[type="checkbox"]').check();

    await page
      .locator('select')
      .filter({ has: page.locator('option[value="sampling"]') })
      .selectOption('sampling');
    await page.getByRole('button', { name: 'Scan Now' }).click();
    await expect(page.getByText('Scan Complete').first()).toBeVisible();

    await page.getByTitle('Analyze Results').click();

    // Step 2 and 3: Table View tab and its header.
    await page.getByRole('button', { name: 'Table View' }).click();
    await expect(page.getByText('Showing 3 rows from this table')).toBeVisible();

    // Step 4: Column Badges.
    const badges = page.getByTestId('column-badge');
    await expect(badges).toHaveCount(3);
    await expect(badges.nth(0)).toHaveText('clean');
    await expect(badges.nth(1)).toHaveText('EMAIL_ADDRESS \u00B7 3 of 3 cells');
    await expect(badges.nth(2)).toHaveText('EMAIL_ADDRESS \u00B7 1 of 3 cells');

    // Step 5: PII Highlights. 3 email cells plus 3 notes cells.
    await expect(page.locator('mark')).toHaveCount(6);

    // Step 6: Raw View shows every secret (this makes the later "absent" check meaningful).
    const rawHtml = await page.content();
    for (const secret of SECRETS) expect(rawHtml).toContain(secret);

    // Step 7: Masked View hides every secret.
    const maskedBtn = page.getByRole('button', { name: 'Masked', exact: true });
    const rawBtn = page.getByRole('button', { name: 'Raw', exact: true });
    await maskedBtn.click();
    await expect(maskedBtn).toHaveAttribute('aria-pressed', 'true');
    const maskedHtml = await page.content();
    for (const secret of SECRETS) expect(maskedHtml).not.toContain(secret);
    expect(maskedHtml).toContain('******');

    // Step 8: back to Raw View.
    await rawBtn.click();
    await expect(rawBtn).toHaveAttribute('aria-pressed', 'true');
    const rawAgainHtml = await page.content();
    for (const secret of SECRETS) expect(rawAgainHtml).toContain(secret);

    // Step 9: exactly one projection request for the whole flow.
    expect(projectionCalls).toHaveLength(1);
    expect(projectionCalls[0].body.scan_mode).toBe('sampling');
    expect(projectionCalls[0].body.table).toBe(TABLE);
    expect(projectionCalls[0].auth ?? '').toMatch(/^Bearer /);

    // Step 10: nothing reached a real backend.
    expect(blocked).toEqual([]);
  });
});