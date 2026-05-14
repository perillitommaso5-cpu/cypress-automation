import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    // Aumentati per ambienti CI con latenza di rete elevata
    pageLoadTimeout: 120000,
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    // cy.session() — riusa la sessione tra test dello stesso spec
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 5,
  },
});
