import { Machine } from "xstate";

const machine = Machine({
  id: "partner",
  context: {
    cards: [],
  },
  initial: "ready",
  states: {
    ready: {},
  },
});

export default machine;
