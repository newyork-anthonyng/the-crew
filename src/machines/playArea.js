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
          discardCards: {
            actions: ["parentDiscardCards"],
            target: "discarding",
          },
        },
      },
      discarding: {
        onExit: ["removeAllCards"],
        on: {
          "": "ready",
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
      removeAllCards: assign(() => {
        return { cards: [] };
      }),
      parentPickupCard: sendParent((_, event) => {
        return { type: "pickupCard", card: event.card };
      }),
      parentDiscardCards: sendParent((context) => {
        return { type: "discardCards", cards: context.cards };
      }),
    },
  }
);

export default machine;
