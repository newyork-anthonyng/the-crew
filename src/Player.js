import React from "react";
import { Machine, assign } from "xstate";
import { loadGame } from "./api";
import { useMachine } from "@xstate/react";

const machine = Machine(
  {
    id: "player",
    context: {
      cards: [],
    },
    initial: "loading",
    states: {
      loading: {
        invoke: {
          src: "loadGameState",
          onDone: {
            actions: ["cacheGameState"],
            target: "ready",
          },
          onError: {
            target: "error",
          },
        },
      },
      ready: {},
      error: {},
    },
  },
  {
    services: {
      loadGameState: loadGame,
    },
    actions: {
      cacheGameState: assign((_, event) => {
        return {
          cards: event.data.cards || [],
        };
      }),
    },
  }
);

function Player() {
  const [state] = useMachine(machine);
  const { cards } = state.context;

  if (state.matches("loading")) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Your hand</h1>
      <div className="flex">
        {cards.map((card) => {
          return (
            <div
              key={`${card.rank}-${card.suit}`}
              style={{ backgroundColor: card.suit, height: 150, width: 107 }}
              className="border-solid border border-black rounded cursor-pointer"
            >
              <span>{card.rank}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </div>
    </div>
  );
}

export default Player;
