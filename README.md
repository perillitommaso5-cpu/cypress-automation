# cypress-automation

> E2E test automation portfolio — Cypress + TypeScript

![CI](https://github.com/perillitommaso5-cpu/cypress-automation/actions/workflows/cypress.yml/badge.svg)

## Stack

| Tool | Version | Purpose |
|---|---|---|
| [Cypress](https://www.cypress.io/) | v13 | E2E test framework |
| TypeScript | v5 strict | Language |
| GitHub Actions | — | CI — Chrome headless on every push |

**Target app:** [SauceDemo](https://www.saucedemo.com) — demo e-commerce application

---

## Project Structure

```
cypress/
├── e2e/                        # Test specs
│   ├── login.cy.ts              # Login — 11 scenarios
│   ├── inventory.cy.ts          # Product catalogue — 8 scenarios
│   ├── cart.cy.ts               # Shopping cart — 8 scenarios
│   ├── checkout.cy.ts           # Checkout — 10 scenarios
│   ├── product-detail.cy.ts     # Product detail — 7 scenarios
│   └── navigation.cy.ts         # Navigation & UX — 6 scenarios
├── fixtures/
│   ├── users.json               # SauceDemo user credentials
│   └── checkout.json            # Checkout form data
├── pages/                       # Page Object Model
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   └── ProductDetailPage.ts
└── support/
    ├── commands.ts              # Custom command: cy.login()
    └── e2e.ts                   # Global support
```

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/perillitommaso5-cpu/cypress-automation.git
cd cypress-automation

# Install dependencies
npm install

# Open Cypress Test Runner (interactive mode)
npm run cy:open

# Run all tests headless
npm run cy:run

# Run specifically on Chrome
npm run cy:run:chrome
```

---

## Test Coverage

| Suite | Scenarios | Description |
|---|---|---|
| **Login** | 11 | Valid users, wrong credentials, empty fields, error UX, logout |
| **Inventory** | 8 | Product list, sorting A→Z/Z→A/price, add/remove from cart, detail navigation |
| **Cart** | 8 | Single/multiple add, removal, empty cart, navigation |
| **Checkout** | 10 | Form validation (4 scenarios), full flow, mathematical total check, cancel |
| **Product Detail** | 7 | Page content, add/remove from cart, button state change, back navigation |
| **Navigation & UX** | 6 | Hamburger menu, logout, reset app state |

**Total: 50 scenarios** across 6 suites

---

## Architecture

### Page Object Model (POM)

Each page has its own class with private selectors and public methods. Tests never access selectors directly — if the app changes an attribute, only the POM needs updating.

```typescript
// Tests use semantic methods
LoginPage.login(users.standard.username, users.standard.password);
InventoryPage.assertLoaded();
InventoryPage.addFirstItemToCart();

// Not raw selectors
cy.get('#user-name').type(...)  // ✗ never in tests
```

### Custom Commands

| Command | Description |
|---|---|
| `cy.login(user, pass)` | Full UI login — visits `/`, fills credentials, clicks the button |

### Fixtures

All test data is kept separate from logic:

- `users.json` — credentials for all 5 SauceDemo users
- `checkout.json` — checkout form data

### Implementation Notes

**`navigation.cy.ts` — Reset App State**
SauceDemo handles reset via `localStorage` but does not reactively update the DOM: `Remove` buttons remain visible until the page is reloaded. The test that verifies the `Add to cart` buttons are restored performs an explicit `cy.reload()` after closing the menu, followed by `assertLoaded()` to wait for page stability before the final assertion.

---

## CI/CD

Every push to `main` and every Pull Request triggers the full suite on GitHub Actions:

- Runner: `ubuntu-latest`
- Browser: Chrome headless
- On failure: screenshots automatically uploaded as artifacts

```yaml
# .github/workflows/cypress.yml
uses: cypress-io/github-action@v6
with:
  browser: chrome
  headed: false
```
