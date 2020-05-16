import { Server } from "miragejs";

const LOAD_GAME_URL = "/api/load";
const PLAY_CARD_URL = "/api/play-card";
const PICKUP_CARD_URL = "/api/pickup-card";
const API_ERROR_CODE = 1;

const server = new Server();
server.get(LOAD_GAME_URL, () => {
  return {
    playAreaCards: [
      { rank: "4", suit: "pink" },
      { rank: "5", suit: "yellow" },
    ],
    playerCards: [
      { rank: "1", suit: "pink" },
      { rank: "2", suit: "yellow" },
      { rank: "3", suit: "green" },
    ],
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

export { loadGame, playCard, pickupCard };
