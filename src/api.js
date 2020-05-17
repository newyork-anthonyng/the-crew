const PLAY_CARD_URL = "/api/play-card";
const PICKUP_CARD_URL = "/api/pickup-card";
const PICKUP_TASK_URL = "/api/pickup-task";
const RETURN_TASK_URL = "/api/return-task";
const DISCARD_CARDS_URL = "/api/discard-cards";
const API_ERROR_CODE = 1;

if (process.env.MIRAGE) {
  const { Server } = require("miragejs");
  const server = new Server();
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
  playCard,
  robotPlayCard,
  pickupCard,
  pickupTask,
  returnTask,
  discardCards,
};
