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
    },
  }
);

export default machine;
