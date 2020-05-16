const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const config = require("./webpack.config");
const path = require("path");
const express = require("express");
const app = express();
const WebSocket = require("ws");
const http = require("http");

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log("received", message);
  });
});

if (process.env.DEV_SERVER) {
  config.entry.app.unshift(
    "webpack-hot-middleware/client?reload=true&timeout=1000"
  );
  config.plugins.push(new webpack.HotModuleReplacementPlugin());

  const compiler = webpack(config);

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath,
    })
  );

  app.use(webpackHotMiddleware(compiler));
}

app.use(`/`, express.static(path.resolve(__dirname, "dist")));
app.get("/api/load", (request, response) => {
  response.json({
    playArea: {
      tasks: [{ rank: "4", suit: "pink" }],
      cards: [
        { rank: "9", suit: "pink" },
        { rank: "5", suit: "yellow" },
      ],
    },
    player: {
      tasks: [
        { rank: "7", suit: "pink" },
        { rank: "2", suit: "yellow" },
      ],
      cards: [
        { rank: "1", suit: "pink" },
        { rank: "2", suit: "yellow" },
        { rank: "3", suit: "green" },
      ],
    },
    partner: {
      tasks: [{ rank: "7", suit: "blue" }],
      cards: [
        { rank: "?", suit: "?" },
        { rank: "?", suit: "?" },
        { rank: "?", suit: "?" },
        { rank: "?", suit: "?" },
      ],
    },
    robot: {
      tasks: [{ rank: "9", suit: "yellow" }],
      cards: [
        [
          { rank: "1", suit: "yellow" },
          { rank: "2", suit: "blue" },
        ],
        [
          { rank: "8", suit: "yellow" },
          { rank: "9", suit: "blue" },
        ],
      ],
    },
    discardAreaCards: [
      { rank: "6", suit: "blue" },
      { rank: "7", suit: "blue" },
    ],
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on ${server.address().port}`);
});
