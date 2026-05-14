# cypress-automation

> E2E test automation portfolio — Cypress + TypeScript

## Stack

- **Framework:** [Cypress](https://www.cypress.io/) v13
- **Language:** TypeScript (strict mode)
- **Pattern:** Page Object Model (POM)
- **Target app:** [SauceDemo](https://www.saucedemo.com) — demo e-commerce
- **CI:** GitHub Actions (Chrome, headless)

## Project Structure

```
cypress/
├── e2e/              # Test specs
│   ├── login.cy.ts
│   └── inventory.cy.ts
├── fixtures/
│   └── users.json    # Test data
├── pages/            # Page Object Model
│   ├── LoginPage.ts
│   └── InventoryPage.ts
└── support/
    ├── commands.ts   # Custom commands
    └── e2e.ts
```

## Getting Started

```bash
# Install dependencies
npm install

# Open Cypress Test Runner (interactive)
npm run cy:open

# Run all tests headless
npm run cy:run
```

## Test Coverage

| Suite | Scenarios |
|---|---|
| Login | Valid login, locked user, wrong credentials |
| Inventory | Product list, add to cart, sort by price |

## CI

Every push to `main` triggers the full suite on GitHub Actions via Chrome headless.
