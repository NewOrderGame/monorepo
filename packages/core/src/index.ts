import { Server, WebSocket } from "ws";

const WS_PORT = 5000;

const wss: Server = new Server({ port: WS_PORT });
console.log(`Started WebSocket on ${WS_PORT} port`);

wss.on("connection", (wsc: WebSocket) => {
  console.log("connection");

  wsc.send("hello from server!");

  wsc.on("message", (message) => {
    const data = message.toString();

    wsc.send("sam ti " + data + "!");
    console.log(data);
  });

  wss.on("error", (error) => {
    console.error(error);
  });
});
