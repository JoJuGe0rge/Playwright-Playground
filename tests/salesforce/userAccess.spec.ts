import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const usernames: string[] = (() => {
	const csvPath = new URL('../../test_data/User Export-11_11_2026-05_00_12.csv', import.meta.url);
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
import passwordResetPage from '../../pages/passwordreset';

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

  return response.json();
}



export async function getSalesforceFrontdoorUrl(
  accessToken: string,
  instanceUrl: string | URL | undefined,
  redirectUri = '/lightning/page/home',
) {
  if (typeof accessToken !== 'string' || !accessToken.trim()) {
    throw new Error('Salesforce did not return an access token.');
  }

  let bridgeUrl;
  try {
    bridgeUrl = new URL('/services/oauth2/singleaccess', instanceUrl);
    if (bridgeUrl.protocol !== 'https:') {
      throw new Error('HTTPS required');
    }
  } catch {
    throw new Error('Salesforce did not return a valid HTTPS instance URL.');
  }

  bridgeUrl.searchParams.set('redirect_uri', redirectUri);

  const response = await fetch(bridgeUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
    redirect: 'error',
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) {
    throw new Error(`Salesforce UI Bridge failed (HTTP ${response.status}). Check token eligibility and app/user session policies.`);
  }

  const payload = await response.json();
  const frontdoorUri = payload?.frontdoor_uri;
  try {
    if (typeof frontdoorUri !== 'string' || new URL(frontdoorUri).protocol !== 'https:') {
      throw new Error('HTTPS URL required');
    }
  } catch {
    throw new Error('Salesforce UI Bridge did not return a valid HTTPS frontdoor URL.');
  }
  return frontdoorUri;
}

/**
 * Logs the given Playwright page into Salesforce using JWT + frontdoor.jsp.
 * Returns the org's instance URL.
 */
export async function loginToSalesforce(
  page: Page,
  retURL = '/lightning/page/home',
  username?: string,
): Promise<string> {
  const resolvedUsername = (username ?? process.env.SF_USERNAME)?.trim();
  if (!resolvedUsername) {
    throw new Error('No Salesforce username provided. Pass a username or set SF_USERNAME in the environment.');
  }

  const { access_token: accessToken, instance_url: instanceUrl } = await getSalesforceAccessToken(resolvedUsername);
  console.log('JWT exchange succeeded. Requesting a Salesforce browser session...');

  const frontdoorUrl = await getSalesforceFrontdoorUrl(accessToken, instanceUrl, retURL);
  console.log('Salesforce UI Bridge succeeded. Opening the requested Salesforce page...');
  page.pause();

  
  new passwordResetPage(page).fillPasswordResetForm('NewPassword123!', 'NewPassword123!', 'MySecurityAnswer');
  console.log(`Logged in and waiting for password reset.`);
  
  const navigationStage = `waiting for ${retURL}`;
  try {
    await page.goto(frontdoorUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await page.waitForURL(`**${retURL}**`, { timeout: 60_000 });
  } catch (error: unknown) {
    const currentUrl = new URL(page.url());
    throw new Error(`Salesforce browser navigation failed (${(error as Error).message}) while ${navigationStage}. Current page: ${currentUrl.origin}${currentUrl.pathname}. Check SSO/MFA requirements, session policies, and Account permissions.`);
  }

  console.log(`Salesforce page reached: ${retURL}`);
  return instanceUrl;
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

