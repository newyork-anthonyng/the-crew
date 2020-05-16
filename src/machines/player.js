import { Machine, sendParent, assign } from "xstate";

const machine = Machine({
  id: "player",
  context: {
    cards: [],
  },
  initial: "ready",
  states: {
    ready: {
      on: {
        SELECT_CARD: {
          actions: [
            assign((context, event) => {
              const { card: selectedCard } = event;

              return {
                cards: context.cards.filter((card) => {
                  const isSameRank = card.rank === selectedCard.rank;
                  const isSameSuit = card.suit === selectedCard.suit;

                  return !(isSameRank && isSameSuit);
                }),
              };
            }),
            sendParent((_, event) => {
              return { type: "playCard", card: event.card };
            }),
          ],
        },
      },
    },
  },
});

export default machine;
