# cypress-automation

> E2E test automation portfolio — Cypress + TypeScript

![CI](https://github.com/perillitommaso5-cpu/cypress-automation/actions/workflows/cypress.yml/badge.svg)

## Stack

| Tool | Version | Purpose |
|---|---|---|
| [Cypress](https://www.cypress.io/) | v13 | E2E test framework |
| TypeScript | v5 strict | Language |
| cypress-axe | v1.5 | WCAG accessibility audits |
| cypress-real-events | v1.13 | Real browser keyboard/mouse events |
| axe-core | v4.9 | Accessibility rules engine |
| GitHub Actions | — | CI — Chrome headless on every push |

**Target app:** [SauceDemo](https://www.saucedemo.com) — demo e-commerce

---

## Project Structure

```
cypress/
├── e2e/                        # Test specs
│   ├── login.cy.ts              # Login — 11 scenari
│   ├── inventory.cy.ts          # Catalogo prodotti — 8 scenari
│   ├── cart.cy.ts               # Carrello — 8 scenari
│   ├── checkout.cy.ts           # Checkout — 10 scenari
│   ├── product-detail.cy.ts     # Dettaglio prodotto — 7 scenari
│   ├── navigation.cy.ts         # Navigation & UX — 6 scenari
│   ├── api-intercept.cy.ts      # API Intercept — 6 scenari
│   ├── visual-dom.cy.ts         # Visual & DOM integrity — 7 scenari
│   ├── accessibility.cy.ts      # Accessibility WCAG 2.1 AA — 4 scenari
│   ├── session.cy.ts            # Session & Auth Guard — 6 scenari
│   ├── performance.cy.ts        # Performance & cy.clock() — 5 scenari
│   └── keyboard-navigation.cy.ts # Keyboard navigation — 4 scenari
├── fixtures/
│   ├── users.json               # Credenziali utenti SauceDemo
│   ├── checkout.json            # Dati form checkout
│   └── placeholder.png          # Immagine stub per test intercept
├── pages/                       # Page Object Model
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   └── ProductDetailPage.ts
└── support/
    ├── commands.ts              # Custom commands: cy.login(), cy.loginBySession()
    └── e2e.ts                   # Global support — importa commands + cypress-axe
```

---

## Getting Started

```bash
# Clona il repository
git clone https://github.com/perillitommaso5-cpu/cypress-automation.git
cd cypress-automation

# Installa le dipendenze
npm install

# Apri Cypress Test Runner (modalità interattiva)
npm run cy:open

# Esegui tutti i test in headless
npm run cy:run

# Esegui su Chrome specificamente
npm run cy:run:chrome
```

---

## Test Coverage

### Funzionale

| Suite | Scenari | Descrizione |
|---|---|---|
| **Login** | 11 | Utenti validi, credenziali errate, campi vuoti, UX errori, logout |
| **Inventory** | 8 | Lista prodotti, sorting A→Z/Z→A/prezzo, aggiunta/rimozione carrello, navigazione dettaglio |
| **Cart** | 8 | Aggiunta singola/multipla, rimozione, carrello vuoto, navigazione |
| **Checkout** | 10 | Validazione form (4 scenari), flusso completo, verifica totale matematico, cancel |
| **Product Detail** | 7 | Contenuto pagina, aggiunta/rimozione carrello, cambio bottone, back navigation |
| **Navigation & UX** | 6 | Hamburger menu, logout, reset app state |

### Avanzato

| Suite | Scenari | Cypress Feature |
|---|---|---|
| **API Intercept** | 6 | `cy.intercept()` — spy su navigazioni, stub immagini, simulazione risposta lenta |
| **Visual & DOM** | 7 | `naturalWidth` check immagini, bug `problem_user` documentato, responsive 375px |
| **Accessibility** | 4 | `cypress-axe` — audit WCAG 2.1 AA su login, catalogo, carrello, checkout |
| **Session & Auth** | 6 | `cy.getAllLocalStorage()`, auth guard su route protette, `cy.session()` caching |
| **Performance** | 5 | Timing login per utente, confronto standard vs glitch, `cy.clock()` + `cy.tick()` |
| **Keyboard Nav** | 4 | `cypress-real-events` — Tab order, login e checkout completabili solo da tastiera |

**Totale: 82 scenari** su 12 suite

---

## Architettura

### Page Object Model (POM)

Ogni pagina ha la sua classe con selettori privati e metodi pubblici. I test non accedono mai ai selettori direttamente — se l'app cambia un attributo, si aggiorna solo il POM.

```typescript
// I test usano metodi semantici
LoginPage.login(users.standard.username, users.standard.password);
InventoryPage.assertLoaded();
InventoryPage.addFirstItemToCart();

// Non selettori raw
cy.get('#user-name').type(...)  // ✗ mai nei test
```

### Custom Commands

| Command | Descrizione |
|---|---|
| `cy.login(user, pass)` | Login completo via UI |
| `cy.loginBySession(user, pass)` | Login cachato con `cy.session()` — più veloce in suite grandi |

### Fixtures

Tutti i dati di test sono separati dalla logica:

- `users.json` — credenziali dei 5 utenti SauceDemo
- `checkout.json` — dati del form di checkout

---

## CI/CD

Ogni push su `main` e ogni Pull Request triggerano la suite completa su GitHub Actions:

- Runner: `ubuntu-latest`
- Browser: Chrome headless
- In caso di fallimento: screenshot automaticamente caricati come artifact

```yaml
# .github/workflows/cypress.yml
uses: cypress-io/github-action@v6
with:
  browser: chrome
  headed: false
```
