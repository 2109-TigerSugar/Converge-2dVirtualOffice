const path = require("path");
const express = require("express");
const morgan = require("morgan");
const PORT = process.env.PORT || 8080;
const app = express();
const compression = require("compression");
const socketio = require("socket.io");
module.exports = app;

const createApp = () => {
  // logging middleware
  app.use(morgan("dev"));

  // body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(compression());

  // static file-serving middleware
  app.use(express.static(path.join(__dirname, "..", "public")));

  // any remaining requests with an extension (.js, .css, etc.) send 404
  app.use((req, res, next) => {
    if (req.originalUrl && req.originalUrl.split("/").pop() === "favicon.ico") {
      return res.sendStatus(204);
    }

    return next();
  });

  // sends index.html
  app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public/index.html"));
  });

  // error handling endware
  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  });
};

const startListening = () => {
  // start listening (and create a 'server' object representing our server)
  const server = app.listen(PORT, () =>
    console.log(`Mixing it up on port ${PORT}`)
  );
  const io = socketio(server);
  require("./socket")(io);
};

async function bootApp() {
  try {
    await createApp();
    await startListening();
  } catch (error) {
    console.error(error);
  }
}

bootApp();
