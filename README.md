# cypress-automation

> E2E test automation portfolio — Cypress + TypeScript

![CI](https://github.com/perillitommaso5-cpu/cypress-automation/actions/workflows/cypress.yml/badge.svg)

## Stack

| Tool | Version | Purpose |
|---|---|---|
| [Cypress](https://www.cypress.io/) | v13 | E2E test framework |
| TypeScript | v5 strict | Language |
| GitHub Actions | — | CI — Chrome headless on ogni push |

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
│   └── navigation.cy.ts         # Navigation & UX — 6 scenari
├── fixtures/
│   ├── users.json               # Credenziali utenti SauceDemo
│   └── checkout.json            # Dati form checkout
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

| Suite | Scenari | Descrizione |
|---|---|---|
| **Login** | 11 | Utenti validi, credenziali errate, campi vuoti, UX errori, logout |
| **Inventory** | 8 | Lista prodotti, sorting A→Z/Z→A/prezzo, aggiunta/rimozione carrello, navigazione dettaglio |
| **Cart** | 8 | Aggiunta singola/multipla, rimozione, carrello vuoto, navigazione |
| **Checkout** | 10 | Validazione form (4 scenari), flusso completo, verifica totale matematico, cancel |
| **Product Detail** | 7 | Contenuto pagina, aggiunta/rimozione carrello, cambio bottone, back navigation |
| **Navigation & UX** | 6 | Hamburger menu, logout, reset app state |

**Totale: 50 scenari** su 6 suite

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
| `cy.login(user, pass)` | Login completo via UI — visita `/`, compila le credenziali, clicca il bottone |

### Fixtures

Tutti i dati di test sono separati dalla logica:

- `users.json` — credenziali dei 5 utenti SauceDemo
- `checkout.json` — dati del form di checkout

### Note implementative

**`navigation.cy.ts` — Reset App State**
SauceDemo gestisce il reset tramite `localStorage` ma non aggiorna il DOM in modo reattivo: i bottoni `Remove` rimangono visibili finché la pagina non viene ricaricata. Il test che verifica il ritorno dei bottoni `Add to cart` esegue un `cy.reload()` esplicito dopo la chiusura del menu, seguito da `assertLoaded()` per attendere la stabilità della pagina prima dell'asserzione finale.

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
