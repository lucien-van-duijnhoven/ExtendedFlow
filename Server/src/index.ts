import express from "express";

const app = express();
const port = 4000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api", (req, res) => {
  res.send({ message: "Hello World!" });
});

function startServer(app, port: number) {
  app
    .listen(port, () => {
      console.log(`Example app listening on port ${port}!`);
    })
    .on("error", (e) => {
      if (e.code === "EADDRINUSE") {
        console.log(
          `ERROR: Port ${port} is already in use, try another one...`
        );
        startServer(app, port + 1);
      } else {
        console.log("ERROR: Can't start server:", e.message);
      }
    });
}
startServer(app, port);
