import React from "react";
import { render } from "react-dom";
import Player from "./Player";
import PlayArea from "./PlayArea";
import DiscardArea from "./DiscardArea";
import "./styles.css";
import machine from "./machines/game";
import { useMachine } from "@xstate/react";

function App() {
  const [state] = useMachine(machine);
  const { playAreaMachine, playerMachine, discardAreaMachine } = state.context;

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

      <DiscardArea discardAreaRef={discardAreaMachine} />
    </div>
  );
}

render(<App />, document.querySelector(".js-root"));
