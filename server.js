require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const WebSocket = require("ws");
const http = require("http");
const Game = require("./gameLogic/index");

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const connections = {};

const game = new Game();
game.createNewGame();

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const parsedMessage = JSON.parse(message);
    console.log(parsedMessage);
    const isPerson1 = parsedMessage.id === process.env.person1;

    switch (parsedMessage.action) {
      case "new": {
        game.createNewGame();
        break;
      }
      case "load": {
        connections[parsedMessage.id] = ws;

        let state;
        if (isPerson1) {
          state = game.getPerson1State();
        } else {
          state = game.getPerson2State();
        }
        ws.send(
          JSON.stringify({
            action: "loadGame",
            ...state,
          })
        );
        break;
      }
      case "play": {
        if (isPerson1) {
          game.player1Plays(parsedMessage.card);
        } else {
          game.player2Plays(parsedMessage.card);
        }

        getOtherConnection(parsedMessage.id).forEach((connection) => {
          connection.send(
            JSON.stringify({
              action: "partnerPlay",
              card: parsedMessage.card,
            })
          );
        });
        break;
      }
      case "robotPlay": {
        game.robotPlays(parsedMessage.card);

        getOtherConnection(parsedMessage.id).forEach((connection) => {
          connection.send(
            JSON.stringify({
              action: "robotPlay",
              card: parsedMessage.card,
            })
          );
        });
        break;
      }
      case "pickupCard": {
        if (isPerson1) {
          game.player1Returns(parsedMessage.card);
        } else {
          game.player2Returns(parsedMessage.card);
        }

        getOtherConnection(parsedMessage.id).forEach((connection) => {
          connection.send(
            JSON.stringify({
              action: "partnerPickup",
              card: parsedMessage.card,
            })
          );
        });
        break;
      }
      case "discardCards": {
        const discardedCards = game.discardCards();

        getOtherConnection(parsedMessage.id).forEach((connection) => {
          connection.send(
            JSON.stringify({
              action: "partnerDiscardCards",
              cards: discardedCards,
            })
          );
        });
        break;
      }
      case "pickupTask": {
        if (isPerson1) {
          game.player1PicksTask(parsedMessage.task);
        } else {
          game.player2PicksTask(parsedMessage.task);
        }

        getOtherConnection(parsedMessage.id).forEach((connection) => {
          connection.send(
            JSON.stringify({
              action: "partnerPickupTask",
              task: parsedMessage.task,
            })
          );
        });
        break;
      }
      case "returnTask": {
        if (isPerson1) {
          game.player1ReturnsTask(parsedMessage.task);
        } else {
          game.player2ReturnsTask(parsedMessage.task);
        }

        getOtherConnection(parsedMessage.id).forEach((connection) => {
          connection.send(
            JSON.stringify({
              action: "partnerReturnTask",
              task: parsedMessage.task,
            })
          );
        });
        break;
      }
    }
  });
});

function getOtherConnection(id) {
  const connectionKeys = Object.keys(connections);

  const result = [];
  for (let i = 0; i < connectionKeys.length; i++) {
    if (id !== connectionKeys[i]) {
      result.push(connections[connectionKeys[i]]);
    }
  }

  return result;
}

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

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on ${server.address().port}`);
});
