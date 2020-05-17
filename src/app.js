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

function getUserName() {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    if (cookies[i].startsWith("name=")) {
      return cookies[i].split("=")[1];
    }
  }
}

const machine = createMachine({
  loadGame: () => {
    websocket.send(JSON.stringify({ id: getUserName(), action: "load" }));
  },
  notifyPlayCard: () => {
    websocket.send(JSON.stringify({ id: getUserName(), action: "play" }));
  },
  notifyRobotPlayCard: () => {
    websocket.send(JSON.stringify({ id: getUserName(), action: "robotPlay" }));
  },
  notifyPickupCard: () => {
    websocket.send(JSON.stringify({ id: getUserName(), action: "pickupCard" }));
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
