import { Server, WebSocket } from "ws";

const WS_PORT = 3000;

const wss: Server = new Server({ port: WS_PORT });

wss.on("connection", async (wsc: WebSocket) => {
  console.log("connection");

  wsc.on("message", async (message) => {
    const data = message.toString();

    console.log(data);
  });
});
