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
            actions: ["discardCard"],
          },
          "partner.discardCards": {
            actions: ["partnerDiscardCards"],
          },
        },
      },
    },
  },
  {
    actions: {
      discardCard: assign((context, event) => {
        const newCards = context.cards.slice();
        newCards.push(event.card);

        return {
          cards: newCards,
        };
      }),
      partnerDiscardCards: assign((context, event) => {
        const newCards = context.cards.slice();
        event.cards.forEach((card) => {
          newCards.push(card);
        });

        return {
          cards: newCards,
        };
      }),
    },
  }
);

export default machine;
