import { Machine, assign, spawn } from "xstate";
import playerMachine from "./player";
import partnerMachine from "./partner";
import robotMachine from "./robot";
import playAreaMachine from "./playArea";
import discardAreaMachine from "./discardAreaMachine";
import {
  pickupCard as notifyPickupCard,
  pickupTask as notifyPickupTask,
  returnTask as notifyReturnTask,
  discardCards as notifyDiscardCards,
} from "../api";

const createMachine = ({ loadGame, playCard, robotPlayCard }) =>
  Machine(
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
          entry: "loadGame",
          on: {
            cacheGameState: {
              actions: ["cacheGameState"],
              target: "ready",
            },
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
            pickupTask: {
              actions: ["addTaskToPlayer", "notifyPickupTask"],
            },
            returnTask: {
              actions: ["addTaskToPlayArea", "notifyReturnTask"],
            },
            discardCards: {
              actions: ["addCardsToDiscardArea", "notifyDiscardCards"],
            },
            partnerPlay: {
              actions: ["playPartnerCard"],
            },
            partnerRobotPlay: {
              actions: ["addToPlayArea", "playRobotCard"],
            },
          },
        },
        error: {},
      },
    },
    {
      actions: {
        loadGame: loadGame,
        playPartnerCard: (context, event) => {
          context.playAreaMachine.send({
            type: "playCard",
            card: event.card,
          });
          context.partnerMachine.send({
            type: "playCard",
          });
        },

        playRobotCard: (context, event) => {
          context.robotMachine.send({
            type: "partnerPlayCard",
            card: event.card,
          });
        },

        cacheGameState: assign((_, event) => {
          const { player, partner, robot, playArea, discardAreaCards } = event;

          return {
            playerMachine: spawn(playerMachine.withContext(player)),
            partnerMachine: spawn(partnerMachine.withContext(partner)),
            robotMachine: spawn(robotMachine.withContext(robot)),
            playAreaMachine: spawn(playAreaMachine.withContext(playArea)),
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
        addTaskToPlayer: (context, event) => {
          const { playerMachine } = context;
          playerMachine.send({
            type: "pickupTask",
            task: event.task,
          });
        },
        addTaskToPlayArea: (context, event) => {
          const { playAreaMachine } = context;
          playAreaMachine.send({
            type: "returnTask",
            task: event.task,
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
          playCard(event.card);
        },
        notifyRobotPlayCard: (_, event) => {
          robotPlayCard(event.card);
        },
        notifyPickupCard: (_, event) => {
          notifyPickupCard(event.card);
        },
        notifyPickupTask: (_, event) => {
          notifyPickupTask(event.task);
        },
        notifyDiscardCards: () => {
          notifyDiscardCards();
        },
        notifyReturnTask: (_, event) => {
          notifyReturnTask(event.task);
        },
      },
    }
  );

export default createMachine;
