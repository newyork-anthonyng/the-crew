import { Machine, assign } from "xstate";

const machine = Machine(
  {
    id: "partner",
    context: {
      cards: [],
      tasks: [],
    },
    initial: "ready",
    states: {
      ready: {
        on: {
          playCard: {
            actions: ["removeCard"],
          },
          returnCard: {
            actions: ["addCard"],
          },
        },
      },
    },
  },
  {
    actions: {
      removeCard: assign((context) => {
        const { cards } = context;
        return {
          cards: cards.slice(1),
        };
      }),
      addCard: assign((context) => {
        const cards = context.cards.slice(0);
        cards.push({ rank: "?", suit: "?" });
        return {
          cards,
        };
      }),
    },
  }
);

export default machine;
