import * as webSocketMock from "./webSocketMock";
import Chainable = Cypress.Chainable;

export const waitForWebSocketToOpen = (): Chainable<any> => {
  return cy.waitUntil(() => webSocketMock.isOpen());
};

export const waitForWebSocketMessage = (
  condition: (message: string) => boolean
) => {
  cy.waitUntil(
    () => webSocketMock.getMessagesReceived().find(condition) !== undefined
  );
};
