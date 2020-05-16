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
    },
  }
);

export default machine;
