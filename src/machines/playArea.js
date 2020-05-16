import { Machine, assign, sendParent } from "xstate";

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
          pickupCard: {
            actions: ["removeCard", "parentPickupCard"],
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

      parentPickupCard: sendParent((_, event) => {
        return { type: "pickupCard", card: event.card };
      }),
    },
  }
);

export default machine;
