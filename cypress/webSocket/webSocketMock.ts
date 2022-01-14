import { Client, Server } from "mock-socket";
import { WebSocket } from "mock-socket";

export type MockMessageHandler = {
    condition: (message: string) => boolean
    handle: (message: string) => string | undefined
}

let mockServer: Server;
let webSocket: Client;

let mockMessageHandlers: MockMessageHandler[] = [];
let messagesReceived: string[] = [];

const log = (message: string) => {
    window.console.info(message);
};

const failMessageHandling = (socket: Client, errorMessage: string) => {
    log(errorMessage);
    socket.close();
    throw Error(errorMessage);
};

const findMessageHandler = (message: string): (MockMessageHandler | undefined) => {
    return mockMessageHandlers.find(handler => handler.condition(message));
}

const onSocketMessage = (socket: Client, data: string | Blob | ArrayBuffer | ArrayBufferView) => {
    log(`WebSocket mock received message: ${data}`);
    if (typeof data !== "string") {
        failMessageHandling(socket, `WebSocket mock received unexpected message type - ${typeof data}, expected string`);
    }
    const message = data as string;
    const handler = findMessageHandler(message)
    if (handler === undefined) {
        failMessageHandling(
            socket,
            `WebSocket mock received unexpected message - no handler defined for message '${message}', please ensure websocketMock.handleMessage with appropriate parameters has been invoked`
        );
    }
    messagesReceived.push(message);
    const messageToSend = handler!.handle(message);
    if (messageToSend !== undefined) {
        sendMessage(messageToSend);
    }

};

export const initialize = (url: string) => {
    if (mockServer) {
        mockServer.close();
    }
    mockServer = new Server(url);
    mockServer.on("connection", socket => {
        webSocket = socket;
        socket.on("message", data => onSocketMessage(socket, data));
        socket.on("close", () => log("WebSocket mock socket closed"));
    });
};

export const sendMessage = (message: string) => {
    log(`WebSocket mock is sending message: ${message}`);
    webSocket.send(message);
};

export const handleMessage = (messageHandler: MockMessageHandler) => {
    mockMessageHandlers.push(messageHandler);
};

export const isOpen = () => {
    return webSocket && webSocket.readyState === WebSocket.OPEN;
};

export const getMessagesReceived = (): string[] => {
    return messagesReceived;
};

