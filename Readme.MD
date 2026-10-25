# Playwright SDET Framework

UI test automation for [saucedemo.com](https://www.saucedemo.com), built with Playwright and TypeScript. The project is structured the way a team framework would be: Page Objects, custom fixtures, separated test data, environment-based configuration, and reproducible random data.

## Tech stack

- Playwright Test
- TypeScript
- Faker (generated test data)
- dotenv (environment configuration)

## Setup

Requires Node.js 20 or newer and Git.

```powershell
git clone <repository-url>
cd Playwright-Playground
npm install
npx playwright install
Copy-Item .env.example .env
```

Open `.env` and fill in the values. The variable names are listed in `.env.example`. The `.env` file holds credentials and is never committed.

## Running the tests

```powershell
npx playwright test                      # run everything
npx playwright test login                # run files whose name contains "login"
npx playwright test --headed             # watch the browser
npx playwright test --workers=1          # run one test at a time
npx playwright show-report               # open the HTML report
```

## Reproducing a failure with random data

The checkout test uses generated data and prints the seed it used. To replay a failed run with the same data, set that seed for one run:

```powershell
$env:SEED=<seed from the log>; npx playwright test checkout
Remove-Item Env:SEED
```

## Project structure

```
pages/        Page Objects: locators and actions for each screen
tests/        Spec files: test steps and assertions only
test_data/    Values the tests choose (JSON files, Faker data factory)
fixtures.ts   Custom fixtures, including a logged-in page
scratch/      Practice files, not part of the suite
.env.example  Names of the required environment variables
```

## Design rules used in this project

- **Page Objects hold locators and actions. Assertions stay in the test files.**
- **Locators that never change are set up once in the constructor.** Locators that depend on an input are built inside the method.
- **Tests ask for what they need through fixtures.** For example, `authenticatedPage` gives a test a page that is already logged in.
- **No hardcoded environment values.** The base URL and credentials come from `.env`.
- **Tests do not depend on each other.** Each test gets its own browser context and creates its own data, so the suite is safe to run in parallel.

## What is covered

- Login flow
- Add to cart, cart count, sorting by price
- Checkout form filled with generated, seedable data

## Planned

- API tests with Playwright
- Reusing a saved login session across tests
- CI pipeline in Azure DevOps
- Reporting and logging improvements
- Visual and accessibility testing