import express from "express";
import bodyParser from "body-parser";
import { WebSocket, WebSocketServer } from "ws";
import type { Express } from "express";
const app = express();
const port = 4000;

app.use(bodyParser.json());

const sockets: WebSocket[] = [];
let storage: Item[] = [];

type Item = {
  type: "grayscale" | "block";
  website: string;
};

app.get("/grayscale", (req, res) => {
  console.log("grayscale request");
  sockets.forEach((socket) => {
    socket.send("grayscale");
  });
  res.status(200).send("OK");
});

app.get("/block", (req, res) => {
  console.log("block request");
  sockets.forEach((socket) => {
    socket.send("block");
  });
  res.status(200).send("OK");
});

function startServer(app: Express, port: number) {
  return app
    .listen(port, () => {
      console.log(`Example app listening on port ${port}!`);
    })
    .on("error", (e) => {
      if (e.name === "EADDRINUSE") {
        console.log(
          `ERROR: Port ${port} is already in use, try another one...`
        );
        startServer(app, port + 1);
      } else {
        console.log("ERROR: Can't start server:", e.message);
      }
    });
}

// Websocket server
const wss = new WebSocketServer({ noServer: true });
wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });

  // log send data
  ws.on("send", function send(data) {
    console.log("send: %s", data);
  });

  // remove socket from array on close
  ws.on("close", () => {
    const index = sockets.indexOf(ws);
    if (index > -1) {
      sockets.splice(index, 1);
    }
  });

  ws.send("something");
  sockets.push(ws);
});

const server = startServer(app, port);
// Connect websocket server to http server
server.on("upgrade", function upgrade(request, socket, head) {
  wss.handleUpgrade(request, socket, head, function done(ws) {
    wss.emit("connection", ws, request);
  });
});
