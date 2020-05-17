const PICKUP_TASK_URL = "/api/pickup-task";
const RETURN_TASK_URL = "/api/return-task";
const DISCARD_CARDS_URL = "/api/discard-cards";
const API_ERROR_CODE = 1;

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

export { pickupTask, returnTask, discardCards };
