import { Machine, assign, sendParent } from "xstate";

const machine = Machine(
  {
    id: "robot",
    context: {
      cards: [],
    },
    initial: "ready",
    states: {
      ready: {
        on: {
          playCard: {
            actions: ["removeCard", "parentPlayCard"],
          },
        },
      },
    },
  },
  {
    actions: {
      removeCard: assign((context, event) => {
        const { card: selectedCard } = event;

        return {
          cards: context.cards.filter((card) => {
            const isSameRank = card.rank === selectedCard.rank;
            const isSameSuit = card.suit === selectedCard.suit;

            return !(isSameRank && isSameSuit);
          }),
        };
      }),
      parentPlayCard: sendParent((_, event) => {
        return { type: "robotPlayCard", card: event.card };
      }),
    },
  }
);

export default machine;
