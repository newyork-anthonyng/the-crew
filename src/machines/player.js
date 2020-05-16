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
          pickupTask: {
            actions: ["pickupTask"],
          },
          returnTask: {
            actions: ["removeTask", "parentReturnTask"],
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
      pickupTask: assign((context, event) => {
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
      parentReturnTask: sendParent((_, event) => {
        return { type: "returnTask", task: event.task };
      }),
    },
  }
);

export default machine;
