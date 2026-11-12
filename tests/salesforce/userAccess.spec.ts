import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const usernames: string[] = (() => {
	const csvPath = new URL('../../test_data/User Export.csv', import.meta.url);
	const csv = readFileSync(csvPath, 'utf-8');
	const rows = csv
		.split(/\r?\n/)
		.map((row) => row.trim())
		.filter(Boolean);

	if (rows.length === 0) {
		throw new Error('No data found in Salesforce user export CSV.');
	}

	const headers = rows[0]
		.split(',')
		.map((header) => header.trim().replace(/^"|"$/g, ''));
	const usernameIndex = headers.findIndex((header) => header.toLowerCase() === 'username');

	if (usernameIndex === -1) {
		throw new Error('Username column not found in Salesforce user export CSV.');
	}
    
	return rows
		.slice(1)
		.map((row) => row.split(',')[usernameIndex]?.trim().replace(/^"|"$/g, ''))
		.filter((username): username is string => Boolean(username));
})();





import type { Page } from '@playwright/test';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load env vars (run from the project root, where .env lives)
dotenv.config({ path: ['.env', '.env.private-key'], quiet: true });

async function getSalesforceAccessToken(username: string): Promise<{ access_token: string; instance_url: string }> {
  const consumerKey = process.env.SF_CONSUMER_KEY?.trim();
  const missing = ['SF_CONSUMER_KEY', 'SF_USERNAME', 'SF_LOGIN_URL', 'SF_PRIVATE_KEY']
    .filter((name) => !process.env[name]?.trim());
  if (missing.length) {
    throw new Error(`Missing configuration: ${missing.join(', ')}. Set these in .env / .env.private-key.`);
  }

  const loginUrl = new URL(process.env.SF_LOGIN_URL!.trim());
  if (loginUrl.protocol !== 'https:') {
    throw new Error('SF_LOGIN_URL must use HTTPS.');
  }
  const privateKey = process.env.SF_PRIVATE_KEY!.trim().replace(/\\n/g, '\n');

  // 1. Sign the JWT with the private key
  let assertion: string;
  try {
    assertion = jwt.sign(
      { iss: consumerKey, sub: username, aud: process.env.SF_JWT_AUDIENCE || loginUrl.origin },
      privateKey,
      { algorithm: 'RS256', expiresIn: '3m' },
    );
  } catch {
    throw new Error('Cannot sign the JWT. Check the key is an unencrypted RSA private key matching the app certificate.');
  }

  // 2. Exchange the JWT for a Salesforce access token
  const response = await fetch(new URL('/services/oauth2/token', loginUrl), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
    redirect: 'error',
    signal: AbortSignal.timeout(30_000),
  });

  // 3. Confirm Salesforce accepted it
  if (!response.ok) {
    throw new Error(`JWT exchange failed (HTTP ${response.status}). Check JWT expiry, audience, subject, and app authorization.`);
  }
  const data = await response.json();
  if (!data.access_token || !data.instance_url || new URL(data.instance_url).protocol !== 'https:') {
    throw new Error('Salesforce did not return an access token and HTTPS instance URL.');
  }
  return data;
}

/**
 * Logs the given Playwright page into Salesforce using JWT + frontdoor.jsp.
 * Returns the org's instance URL.
 */
export async function loginToSalesforce(page: Page, retURL = '/lightning/page/home', username: string): Promise<string> {
  const { access_token, instance_url } = await getSalesforceAccessToken(username);
  console.log(`JWT exchange succeeded for ${username} at ${instance_url}`); // never log the token

  const frontdoor = new URL('/secur/frontdoor.jsp', instance_url);
  frontdoor.searchParams.set('sid', access_token);
  frontdoor.searchParams.set('retURL', retURL);

  await page.goto(frontdoor.href, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForURL('**/lightning/**', { timeout: 60_000 });
  return instance_url;
}



test.describe('Salesforce user access', () => {
    console.log('Usernames which are loaded from CSV:', usernames);
	for (const username of usernames) {
		test(`logs in as ${username}`, async ({ page }) => {
			await loginToSalesforce(page, '/lightning/o/Account/list', username);
            await expect(page).toHaveURL(/lightning\/o\/Account\/list/, { timeout: 30_000 });
            await expect(page).toHaveTitle(/Accounts/, { timeout: 30_000 });
		});
	}
});

