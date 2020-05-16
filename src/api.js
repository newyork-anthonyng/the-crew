import { Server } from "miragejs";
const server = new Server();
server.get("/api/load", () => {
  return {
    cards: [
      { rank: "1", suit: "pink" },
      { rank: "2", suit: "yellow" },
      { rank: "3", suit: "green" },
    ],
  };
});

const API_ERROR_CODE = 1;

const LOAD_GAME_URL = "/api/load";
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

export { loadGame };
