import { Server, WebSocket } from "ws";

const WS_PORT = 3000;

const wss: Server = new Server({ port: WS_PORT });
console.log("started server on 3000 port");

wss.on("connection", async (wsc: WebSocket) => {
  console.log("connection");

  wsc.on("message", async (message) => {
    const data = message.toString();

    wsc.send('sam ti ' + data);
    console.log(data);
  });
});
