import React from "react";
import { render } from "react-dom";
import Player from "./components/Player";
import Partner from "./components/Partner";
import PlayArea from "./components/PlayArea";
import DiscardArea from "./components/DiscardArea";
import "./styles.css";
import machine from "./machines/game";
import { useMachine } from "@xstate/react";

function App() {
  const [state, send] = useMachine(machine);
  const {
    playAreaMachine,
    playerMachine,
    partnerMachine,
    discardAreaMachine,
  } = state.context;

  const test = () =>
    send({ type: "applesauce", card: { suit: "trump", rank: "7" } });

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
      <button
        onClick={test}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Debug: Press button to have Partner play a card
      </button>
      <Player playerRef={playerMachine} />

      <PlayArea playAreaRef={playAreaMachine} />

      <Partner partnerRef={partnerMachine} />

      <DiscardArea discardAreaRef={discardAreaMachine} />
    </div>
  );
}

render(<App />, document.querySelector(".js-root"));
