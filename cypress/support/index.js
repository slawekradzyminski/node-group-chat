// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// See https://github.com/cypress-io/cypress/issues/300#issuecomment-688915086 - we want to log console output to Cypress command log,
// but not in headless mode to prevent double logging in CI (as cypress-terminal-logging logs all console output to stdout).
const logConsoleMessagesToCypressCommandOutput = () => {
  if (Cypress.browser.isHeadless) {
    return;
  }
  Cypress.on("window:before:load", win => {
    cy.spy(win.console, "error");
    cy.spy(win.console, "warn");
    cy.spy(win.console, "info");
    cy.spy(win.console, "log");
  });
};

logConsoleMessagesToCypressCommandOutput();
