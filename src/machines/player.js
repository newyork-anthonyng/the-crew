import { Machine, sendParent, assign } from "xstate";

const machine = Machine(
  {
    id: "player",
    context: {
      cards: [],
      tasks: [],
    },
    initial: "ready",
    states: {
      ready: {
        on: {
          selectCard: {
            actions: ["removeCard", "parentPlayCard"],
          },
          pickupCard: {
            actions: ["pickupCard"],
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
        return { type: "playCard", card: event.card };
      }),
      pickupCard: assign((context, event) => {
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
