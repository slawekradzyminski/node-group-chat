import * as webSocketMock from "../webSocket/webSocketMock";
import { visitWithWebSocketMock } from "../webSocket/visitWithWebSocketMock";
import {
  waitForWebSocketToOpen,
  waitForWebSocketMessage,
} from "../webSocket/webSocketWaits";

describe("websocket test", () => {
  beforeEach(() => {
    visitWithWebSocketMock("/", "ws://localhost:8080/socket.io/");
  });

  it("server sends a message -> should be displayed in browser", () => {
    webSocketMock.sendMessage(`42["is_online","<i>Pokachu join the chat..</i>"]`);
    webSocketMock.sendMessage(`42["chat_message","<strong>Pokachu</strong>: Poka!"]`);
    webSocketMock.sendMessage(`42["is_offline","<i>Pokachu left the chat..</i>"]`);
    cy.get("#messages").should("contain.text", "Pokachu join the chat..");
    cy.get("#messages").should("contain", "Poka!");
    cy.get("#messages").should("contain.text", "Pokachu left the chat..")
  });

  it("browser sends a message -> should arrive at server", () => {
    webSocketMock.handleMessage({
      condition: (msg) => msg.includes("chat_message") && msg.includes("Pika!"),
      handle: () => `42["chat_message", "<strong>Pikachu</strong>: Pika!"]`,
    });

    // browser sends a message -> should arrive at server
    cy.get(`#txt`).type("Pika!{enter}");
    waitForWebSocketMessage((msg) => msg.includes("Pika!"));
    cy.get("#messages").should("contain", "Pika!");
  });
});
