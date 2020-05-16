import { Machine, assign } from "xstate";

const machine = Machine(
  {
    id: "discard-area",
    context: {
      cards: [],
    },
    initial: "ready",
    states: {
      ready: {
        on: {
          discardCard: {
            actions: ["addCard"],
          },
        },
      },
    },
  },
  {
    actions: {
      addCard: assign((context, event) => {
        const newCards = context.cards.slice();
        newCards.push(event.card);

        return {
          cards: newCards,
        };
      }),
    },
  }
);

export default machine;
