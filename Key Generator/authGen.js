import { chromium } from 'playwright';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath, pathToFileURL } from 'node:url';

dotenv.config({
  path: ['../.env', '../.env.private-key'].map((name) => fileURLToPath(new URL(name, import.meta.url))),
  quiet: true,
 });

export async function getSalesforceAccessToken() {
 const consumerKey = process.env.SF_CONSUMER_KEY?.trim();
 const username = process.env.SF_USERNAME?.trim();
 console.log(`Using Salesforce username: ${username}`);
 console.log(`Using Salesforce consumer key: ${consumerKey}`);
 console.log(`Using Salesforce login URL: ${process.env.SF_LOGIN_URL}`);
 //console.log(`Using Salesforce JWT audience: ${process.env.SF_JWT_AUDIENCE || loginUrl.origin}`);
 console.log(`Using Salesforce private key: ${process.env.SF_PRIVATE_KEY ? '***' : 'Not set'}`);

 const missingSettings = ['SF_CONSUMER_KEY', 'SF_USERNAME', 'SF_LOGIN_URL', 'SF_PRIVATE_KEY']
  .filter((name) => !process.env[name]?.trim());
 if (missingSettings.length) {
  throw new Error(`Missing configuration: ${missingSettings.join(', ')}. Set these in .env or your environment.`);
 }
 const loginUrl = new URL(process.env.SF_LOGIN_URL);
 if (loginUrl.protocol !== 'https:') {
  throw new Error('SF_LOGIN_URL must use HTTPS.');
 }

 const privateKey = process.env.SF_PRIVATE_KEY.trim().replace(/\\n/g, '\n');

 let assertion;
 try {
  assertion = jwt.sign({
   iss: consumerKey,
   sub: username,
   aud: process.env.SF_JWT_AUDIENCE || loginUrl.origin,
  }, privateKey, { algorithm: 'RS256', expiresIn: '3m' });
 } catch {
  throw new Error('Cannot sign the JWT. Check that the key is an unencrypted RSA private key matching the app certificate.');
 }

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

 if (!response.ok) {
  throw new Error(`JWT exchange failed (HTTP ${response.status}). Check JWT expiry, audience, subject, and app authorization.`);
 }

 return response.json();
}

async function main() {
 
 const { access_token: accessToken, instance_url: instanceUrl } = await getSalesforceAccessToken();
 if (!accessToken || !instanceUrl || new URL(instanceUrl).protocol !== 'https:') {
  throw new Error('Salesforce did not return an access token and HTTPS instance URL.');
 }
 console.log('JWT exchange succeeded. Opening Salesforce Accounts...');

 const frontdoorUrl = new URL('/secur/frontdoor.jsp', instanceUrl);
 frontdoorUrl.searchParams.set('sid', accessToken);
 frontdoorUrl.searchParams.set('retURL', '/lightning/o/Account/list');

 const browser = await chromium.launch({ headless: false });
 try {
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
   await page.goto(frontdoorUrl.href, { waitUntil: 'domcontentloaded', timeout: 60_000 });
   await page.waitForURL('**/lightning/o/Account/list**', { timeout: 60_000 });
  } catch {
   throw new Error('JWT exchange succeeded, but the Accounts page did not open. Check browser-session eligibility, org policies, and Account permissions.');
  }
  console.log('Accounts list URL reached. Close the browser window when finished.');
  await page.waitForEvent('close', { timeout: 0 });
 } finally {
  await browser.close();
 }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
 main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
 });
}
 