import { Machine, assign, spawn } from "xstate";
import playerMachine from "./player";
import partnerMachine from "./partner";
import robotMachine from "./robot";
import playAreaMachine from "./playArea";
import discardAreaMachine from "./discardAreaMachine";
import {
  loadGame,
  playCard as notifyPlayCard,
  robotPlayCard as notifyRobotPlayCard,
  pickupCard as notifyPickupCard,
  discardCards as notifyDiscardCards,
} from "../api";

const machine = Machine(
  {
    id: "game",
    context: {
      playerMachine: null,
      partnerMachine: null,
      robotMachine: null,
      playAreaMachine: null,
      discardAreaMachine: null,
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
          robotPlayCard: {
            actions: ["addToPlayArea", "notifyRobotPlayCard"],
          },
          pickupCard: {
            actions: ["addToPlayer", "notifyPickupCard"],
          },
          discardCards: {
            actions: ["addCardsToDiscardArea", "notifyDiscardCards"],
          },
          applesauce: {
            actions: [
              (context, event) => {
                // @FUTURE: This tests that partner can play a card
                context.playAreaMachine.send({
                  type: "playCard",
                  card: event.card,
                });
                context.partnerMachine.send({
                  type: "playCard",
                });
              },
            ],
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
        const {
          player,
          partner,
          robot,
          playAreaCards,
          discardAreaCards,
        } = event.data;

        return {
          playerMachine: spawn(playerMachine.withContext(player)),
          partnerMachine: spawn(
            partnerMachine.withContext({ cards: partner.cards })
          ),
          robotMachine: spawn(robotMachine.withContext({ cards: robot.cards })),
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
      addCardsToDiscardArea: (context, event) => {
        const { discardAreaMachine } = context;
        const { cards } = event;

        cards.forEach((card) => {
          discardAreaMachine.send({
            type: "discardCard",
            card,
          });
        });
      },
      notifyPlayCard: (_, event) => {
        notifyPlayCard(event.card);
      },
      notifyRobotPlayCard: (_, event) => {
        notifyRobotPlayCard(event.card);
      },
      notifyPickupCard: (_, event) => {
        notifyPickupCard(event.card);
      },
      notifyDiscardCards: () => {
        notifyDiscardCards();
      },
    },
  }
);

export default machine;
