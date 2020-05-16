import { Machine, assign, spawn } from "xstate";
import playerMachine from "./player";
import playAreaMachine from "./playArea";
import { loadGame, playCard as notifyPlayCard } from "../api";

const machine = Machine(
  {
    id: "game",
    context: {
      playerMachine: null,
      playAreaMachine: null,
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
      ready: {
        on: {
          playCard: {
            actions: ["addToPlayArea", "notifyPlayCard"],
          },
        },
      },
      error: {},
    },
  },
  {
    services: {
      loadGame: loadGame,
    },
    actions: {
      cacheGameState: assign((context, event) => {
        const { playerCards, playAreaCards } = event.data;
        return {
          playerMachine: spawn(
            playerMachine.withContext({ cards: playerCards })
          ),
          playAreaMachine: spawn(
            playAreaMachine.withContext({ cards: playAreaCards })
          ),
        };
      }),
      addToPlayArea: (context, event) => {
        const { playAreaMachine } = context;
        playAreaMachine.send({
          type: "playCard",
          card: event.card,
        });
      },
      notifyPlayCard: (context, event) => {
        notifyPlayCard(event.card);
      },
    },
  }
);

export default machine;
