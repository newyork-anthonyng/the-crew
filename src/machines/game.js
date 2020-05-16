import { Machine, assign, spawn } from "xstate";
import playerMachine from "./player";
import playAreaMachine from "./playArea";
import discardAreaMachine from "./discardAreaMachine";
import {
  loadGame,
  playCard as notifyPlayCard,
  pickupCard as notifyPickupCard,
} from "../api";

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
          pickupCard: {
            actions: ["addToPlayer", "notifyPickupCard"],
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
      cacheGameState: assign((_, event) => {
        const { playerCards, playAreaCards, discardAreaCards } = event.data;
        return {
          playerMachine: spawn(
            playerMachine.withContext({ cards: playerCards })
          ),
          playAreaMachine: spawn(
            playAreaMachine.withContext({ cards: playAreaCards })
          ),
          discardAreaMachine: spawn(
            discardAreaMachine.withContext({ cards: discardAreaCards })
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
      addToPlayer: (context, event) => {
        const { playerMachine } = context;
        playerMachine.send({
          type: "pickupCard",
          card: event.card,
        });
      },
      notifyPlayCard: (_, event) => {
        notifyPlayCard(event.card);
      },
      notifyPickupCard: (_, event) => {
        notifyPickupCard(event.card);
      },
    },
  }
);

export default machine;
