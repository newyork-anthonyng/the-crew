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

        const cards = context.cards.map((column) => {
          const faceupCard = column[0];
          const isSameRank = faceupCard.rank === selectedCard.rank;
          const isSameSuit = faceupCard.suit === selectedCard.suit;

          if (isSameRank && isSameSuit) {
            return [column[1]];
          } else {
            return column;
          }
        });

        return {
          cards: cards.filter((card) => {
            return !!card[0];
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
