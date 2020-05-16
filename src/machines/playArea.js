import { Machine, assign } from "xstate";

const machine = Machine(
  {
    id: "play-area",
    context: {
      cards: [],
    },
    initial: "ready",
    states: {
      ready: {
        on: {
          playCard: {
            actions: ["addCard"],
          },
        },
      },
    },
  },
  {
    actions: {
      addCard: assign((context, event) => {
        return {
          cards: [...context.cards, event.card],
        };
      }),
    },
  }
);

export default machine;
