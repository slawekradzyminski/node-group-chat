import * as webSocketMock from "./webSocketMock";

// see https://github.com/socketio/engine.io-protocol

export const webSocketMessages = {
  handleUpgrade: () => {
    webSocketMock.handleMessage({
      condition: (msg) => msg === "5",
      handle: () => undefined,
    });
  },
  
  handleProbe: () => {
    webSocketMock.handleMessage({
        condition: (msg) => msg === "2probe",
        handle: () => "3probe",
      });
  },

  handleNewUser: () => {
    webSocketMock.handleMessage({
        condition: (msg) => msg.includes("username"),
        handle: () => undefined,
      });
  }
};

