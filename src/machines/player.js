import { Machine } from "xstate";

const machine = Machine({
  id: "player",
  context: {
    cards: [],
  },
  initial: "ready",
  states: {
    ready: {},
  },
});

export default machine;
