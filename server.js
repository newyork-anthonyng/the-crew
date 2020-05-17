const path = require("path");
const express = require("express");
const app = express();
const WebSocket = require("ws");
const http = require("http");

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const connections = {};
wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    // FUTURE: Why do we need to double-parse??
    let parsedMessage = JSON.parse(message);
    parsedMessage = JSON.parse(parsedMessage);

    console.log("received message", parsedMessage);
    switch (parsedMessage.action) {
      case "load":
        connections[parsedMessage.id] = ws;
        ws.send(
          JSON.stringify({
            action: "loadGame",
            playArea: {
              tasks: [{ rank: "4", suit: "orange" }],
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
          })
        );
        break;
      case "play": {
        const connectionKeys = Object.keys(connections);

        for (let i = 0; i < connectionKeys.length; i++) {
          if (parsedMessage.id !== connectionKeys[i]) {
            connections[connectionKeys[i]].send(
              JSON.stringify({
                action: "partnerPlay",
                card: {
                  rank: "42",
                  suit: "blue",
                },
              })
            );
          }
        }
        break;
      }
      case "robotPlay": {
        const connectionKeys = Object.keys(connections);

        for (let i = 0; i < connectionKeys.length; i++) {
          if (parsedMessage.id !== connectionKeys[i]) {
            connections[connectionKeys[i]].send(
              JSON.stringify({
                action: "robotPlay",
                card: {
                  rank: "1",
                  suit: "yellow",
                },
              })
            );
          }
        }
        break;
      }
      case "pickupCard": {
        const connectionKeys = Object.keys(connections);

        for (let i = 0; i < connectionKeys.length; i++) {
          if (parsedMessage.id !== connectionKeys[i]) {
            connections[connectionKeys[i]].send(
              JSON.stringify({
                action: "partnerPickup",
                card: {
                  rank: "9",
                  suit: "pink",
                },
              })
            );
          }
        }
        break;
      }
    }
  });
});

if (process.env.DEV_SERVER) {
  const webpack = require("webpack");
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const webpackHotMiddleware = require("webpack-hot-middleware");
  const config = require("./webpack.config");

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
