import { Machine, assign } from "xstate";

const machine = Machine(
  {
    id: "partner",
    context: {
      cards: [],
      tasks: [],
    },
    initial: "ready",
    states: {
      ready: {
        on: {
          playCard: {
            actions: ["removeCard"],
          },
          returnCard: {
            actions: ["addCard"],
          },
          pickupTask: {
            actions: ["addTask"],
          },
          returnTask: {
            actions: ["returnTask"],
          },
        },
      },
    },
  },
  {
    actions: {
      removeCard: assign((context) => {
        const { cards } = context;
        return {
          cards: cards.slice(1),
        };
      }),
      addCard: assign((context) => {
        const cards = context.cards.slice(0);
        cards.push({ rank: "?", suit: "?" });
        return {
          cards,
        };
      }),
      addTask: assign((context, event) => {
        const newTasks = context.tasks.slice();
        newTasks.push(event.task);

        return {
          tasks: newTasks,
        };
      }),
      returnTask: assign((context, event) => {
        const { task: selectedTask } = event;

        return {
          tasks: context.tasks.filter((task) => {
            const isSameRank = task.rank === selectedTask.rank;
            const isSameSuit = task.suit === selectedTask.suit;

            return !(isSameRank && isSameSuit);
          }),
        };
      }),
    },
  }
);

export default machine;
