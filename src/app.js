import React, { useEffect } from "react";
import { render } from "react-dom";
import Player from "./components/Player";
import Partner from "./components/Partner";
import PlayArea from "./components/PlayArea";
import Robot from "./components/Robot";
import DiscardArea from "./components/DiscardArea";
import "./styles.css";
import createMachine from "./machines/game";
import { useMachine } from "@xstate/react";
import WebSocketWrapper from "./websocketWrapper";
import setupCookie from "./cookie";

const websocket = new WebSocketWrapper();
setupCookie();

const machine = createMachine({
  loadGame: () => {
    websocket.send({ action: "load" });
  },
  notifyPlayCard: (card) => {
    websocket.send({ action: "play", card });
  },
  notifyRobotPlayCard: (card) => {
    websocket.send({ action: "robotPlay", card });
  },
  notifyPickupCard: (card) => {
    websocket.send({ action: "pickupCard", card });
  },
  notifyDiscardCards: () => {
    websocket.send({ action: "discardCards" });
  },
  notifyPickupTask: (task) => {
    websocket.send({ action: "pickupTask", task });
  },
  notifyReturnTask: (task) => {
    websocket.send({ action: "returnTask", task });
  },
});

function App() {
  const [state, send] = useMachine(machine);
  const {
    playAreaMachine,
    playerMachine,
    partnerMachine,
    robotMachine,
    discardAreaMachine,
  } = state.context;

  useEffect(() => {
    websocket.onMessage((message) => {
      const parsedMessage = JSON.parse(message.data);
      console.group(
        "%cparsedMessage",
        "background-color: green; color: white;"
      );
      console.log(parsedMessage);
      console.groupEnd(
        "%cparsedMessage",
        "background-color: green; color: white;"
      );

      switch (parsedMessage.action) {
        case "loadGame":
          send({ type: "cacheGameState", ...parsedMessage });
          break;
        case "partnerPlay":
          send({ type: "partner.play", ...parsedMessage });
          break;
        case "robotPlay":
          send({ type: "partner.robotPlay", ...parsedMessage });
          break;
        case "partnerPickup":
          send({ type: "partner.pickup", ...parsedMessage });
          break;
        case "partnerDiscardCards":
          send({ type: "partner.discardCards", ...parsedMessage });
          break;
        case "partnerPickupTask":
          send({ type: "partner.pickupTask", ...parsedMessage });
          break;
        case "partnerReturnTask":
          send({ type: "partner.returnTask", ...parsedMessage });
          break;
      }
    });
  }, []);

  if (state.matches("loading")) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (state.matches("error")) {
    return (
      <div>
        <p>Error loading game. Please refresh page.</p>
      </div>
    );
  }

  return (
    <div>
      <Player playerRef={playerMachine} />

      <PlayArea playAreaRef={playAreaMachine} />

      <Partner partnerRef={partnerMachine} />

      <Robot robotRef={robotMachine} />

      <DiscardArea discardAreaRef={discardAreaMachine} />
    </div>
  );
}

render(<App />, document.querySelector(".js-root"));
