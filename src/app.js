import React from "react";
import { render } from "react-dom";
import Player from "./Player";
import PlayArea from "./PlayArea";
import "./styles.css";
import { Machine, assign, spawn } from "xstate";
import playerMachine from "./machines/player";
import { useMachine } from "@xstate/react";
import { loadGame } from "./api";

const machine = Machine(
  {
    id: "game",
    context: {
      playerMachine: null,
    },
    initial: "loading",
    states: {
      loading: {
        invoke: {
          src: "loadGame",
          onDone: {
            actions: ["cacheGameState"],
            target: "ready",
          },
          onError: "error",
        },
      },
      ready: {},
      error: {},
    },
  },
  {
    services: {
      loadGame: loadGame,
    },
    actions: {
      cacheGameState: assign((context, event) => {
        // console.group("cacheGameState");
        // console.log(event);
        // console.groupEnd("cacheGameState");
        const { playerCards } = event.data;
        // playerMachine.send({ type: "loadGameState", data: playerCards });
        return {
          playerMachine: spawn(
            playerMachine.withContext({ cards: playerCards })
          ),
        };
      }),
    },
  }
);

function App() {
  const [state] = useMachine(machine);
  const { playerMachine } = state.context;
  console.group("App");
  console.log(playerMachine);
  console.log(spawn(playerMachine));
  console.groupEnd("App");

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

      <PlayArea />
    </div>
  );
}

render(<App />, document.querySelector(".js-root"));
