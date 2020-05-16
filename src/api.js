import { Server } from "miragejs";

const LOAD_GAME_URL = "/api/load";
const PLAY_CARD_URL = "/api/play-card";
const PICKUP_CARD_URL = "/api/pickup-card";
const PICKUP_TASK_URL = "/api/pickup-task";
const RETURN_TASK_URL = "/api/return-task";
const DISCARD_CARDS_URL = "/api/discard-cards";
const API_ERROR_CODE = 1;

const server = new Server();
server.get(LOAD_GAME_URL, () => {
  return {
    playArea: {
      tasks: [{ rank: "4", suit: "pink" }],
      cards: [
        { rank: "4", suit: "pink" },
        { rank: "5", suit: "yellow" },
      ],
    },
    player: {
      tasks: [
        { rank: "7", suit: "pink" },
        { rank: "2", suit: "yellow" },
      ],
      cards: [
        { rank: "1", suit: "pink" },
        { rank: "2", suit: "yellow" },
        { rank: "3", suit: "green" },
      ],
    },
    partner: {
      tasks: [{ rank: "7", suit: "blue" }],
      cards: [
        { rank: "?", suit: "?" },
        { rank: "?", suit: "?" },
        { rank: "?", suit: "?" },
        { rank: "?", suit: "?" },
      ],
    },
    robot: {
      tasks: [{ rank: "9", suit: "yellow" }],
      cards: [
        [
          { rank: "1", suit: "yellow" },
          { rank: "2", suit: "blue" },
        ],
        [
          { rank: "8", suit: "yellow" },
          { rank: "9", suit: "blue" },
        ],
      ],
    },
    discardAreaCards: [
      { rank: "6", suit: "blue" },
      { rank: "7", suit: "blue" },
    ],
  };
});
server.post(PLAY_CARD_URL, () => {
  return {};
});
server.post(PICKUP_CARD_URL, () => {
  return {};
});
server.post(PICKUP_TASK_URL, () => {
  return {};
});
server.post(RETURN_TASK_URL, () => {
  return {};
});

function loadGame() {
  return new Promise((resolve, reject) => {
    fetch(LOAD_GAME_URL)
      .then((response) => {
        if (!response.ok) {
          reject({ code: API_ERROR_CODE, message: "Something went wrong" });
        }
        return response.json();
      })
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        reject({ code: API_ERROR_CODE, message: e });
      });
  });
}

function playCard(card) {
  return new Promise((resolve, reject) => {
    fetch(PLAY_CARD_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        actor: "player",
        card,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          reject({ code: API_ERROR_CODE, message: "Something went wrong" });
        }
      })
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        reject({ code: API_ERROR_CODE, message: e });
      });
  });
}

function robotPlayCard(card) {
  return new Promise((resolve, reject) => {
    fetch(PLAY_CARD_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        actor: "robot",
        card,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          reject({ code: API_ERROR_CODE, message: "Something went wrong" });
        }
      })
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        reject({ code: API_ERROR_CODE, message: e });
      });
  });
}

function pickupCard(card) {
  return new Promise((resolve, reject) => {
    fetch(PICKUP_CARD_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        card,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          reject({ code: API_ERROR_CODE, message: "Something went wrong" });
        }
      })
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        reject({ code: API_ERROR_CODE, message: e });
      });
  });
}

function pickupTask(task) {
  return new Promise((resolve, reject) => {
    fetch(PICKUP_TASK_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          reject({ code: API_ERROR_CODE, message: "Something went wrong" });
        }
      })
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        reject({ code: API_ERROR_CODE, message: e });
      });
  });
}

function returnTask(task) {
  return new Promise((resolve, reject) => {
    fetch(RETURN_TASK_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          reject({ code: API_ERROR_CODE, message: "Something went wrong" });
        }
      })
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        reject({ code: API_ERROR_CODE, message: e });
      });
  });
}

function discardCards() {
  return new Promise((resolve, reject) => {
    fetch(DISCARD_CARDS_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          reject({ code: API_ERROR_CODE, message: "Something went wrong" });
        }
      })
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        reject({ code: API_ERROR_CODE, message: e });
      });
  });
}

export {
  loadGame,
  playCard,
  robotPlayCard,
  pickupCard,
  pickupTask,
  returnTask,
  discardCards,
};
