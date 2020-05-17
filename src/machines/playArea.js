import { Machine, assign, sendParent } from "xstate";

const machine = Machine(
  {
    id: "play-area",
    context: {
      cards: [],
      tasks: [],
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
          pickupTask: {
            actions: ["removeTask", "parentPickupTask"],
          },
          returnTask: {
            actions: ["addTask"],
          },
          discardCards: {
            actions: ["parentDiscardCards"],
            target: "discarding",
          },
          removeCard: {
            actions: ["removeCard"],
          },
          "partner.discardCards": {
            actions: ["partnerDiscardCards"],
          },
          "partner.pickupTask": {
            actions: ["partnerPickupTask"],
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
      partnerDiscardCards: assign(() => {
        return {
          cards: [],
        };
      }),
      partnerPickupTask: assign((context, event) => {
        const { task: selectedTask } = event;

        return {
          tasks: context.tasks.filter((task) => {
            const isSameRank = task.rank === selectedTask.rank;
            const isSameSuit = task.suit === selectedTask.suit;

            return !(isSameRank && isSameSuit);
          }),
        };
      }),
      addTask: assign((context, event) => {
        const newTasks = context.tasks.slice();
        newTasks.push(event.task);

        return {
          tasks: newTasks,
        };
      }),
      removeTask: assign((context, event) => {
        const { task: selectedTask } = event;

        return {
          tasks: context.tasks.filter((task) => {
            const isSameRank = task.rank === selectedTask.rank;
            const isSameSuit = task.suit === selectedTask.suit;

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
      parentPickupTask: sendParent((_, event) => {
        return { type: "pickupTask", task: event.task };
      }),
      parentDiscardCards: sendParent((context) => {
        return { type: "discardCards", cards: context.cards };
      }),
    },
  }
);

export default machine;
