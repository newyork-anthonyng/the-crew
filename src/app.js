import React, { useEffect } from "react";
import { render } from "react-dom";
import Player from "./components/Player";
import Partner from "./components/Partner";
import PlayArea from "./components/PlayArea";
import Robot from "./components/Robot";
import DiscardArea from "./components/DiscardArea";
import "./styles.css";
import machine from "./machines/game";
import { useMachine } from "@xstate/react";

function getWebSocketHost() {
  return location.origin.replace(/^http/, "ws");
}

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
    const socket = new WebSocket(getWebSocketHost());

    socket.addEventListener("open", function () {
      socket.send("Hello Server! 💩");
    });

    socket.addEventListener("message", (event) => {
      console.log(`Message from server: ${event.data}`);

      send({ type: "applesauce", card: { suit: "trump", rank: "7" } });
    });

    return () => {
      socket.send("close");
      socket.close();
    };
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
      {/* <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Debug: Press button to have Partner play a card
      </button> */}
      <Player playerRef={playerMachine} />

      <PlayArea playAreaRef={playAreaMachine} />

      <Partner partnerRef={partnerMachine} />

      <Robot robotRef={robotMachine} />

      <DiscardArea discardAreaRef={discardAreaMachine} />
    </div>
  );
}

render(<App />, document.querySelector(".js-root"));
