import * as webSocketMock from "./webSocketMock";
import { WebSocket as MockSocket } from "mock-socket";
import { webSocketMessages } from "./webSocketMessageHandlers";
import { waitForWebSocketMessage, waitForWebSocketToOpen } from "./webSocketWaits";

export const visitWithWebSocketMock = (
  visitUrl: string,
  webSocketUrl: string
) => {
  webSocketMock.initialize(webSocketUrl);
  webSocketMessages.handleUpgrade();
  webSocketMessages.handleProbe();
  webSocketMessages.handleNewUser();

  cy.visit(visitUrl, {
    onBeforeLoad: (win) => {
      cy.stub(win, "prompt").returns("Pikachu");
      cy.stub(win, "WebSocket", (url) => {
        win.console.info(`Mock WebSocket initialize: ${url}`);
        return new MockSocket(url);
      });
    },
  })
    .then(() => waitForWebSocketToOpen())
};

