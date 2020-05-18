function getUserName() {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    if (cookies[i].startsWith("name=")) {
      return cookies[i].split("=")[1];
    }
  }
}

function WebSocketWrapper() {
  const host = location.origin.replace(/^http/, "ws");
  const socket = new WebSocket(host);

  let isSocketOpen = false;
  let isEventListenerAdded = false;
  socket.addEventListener("open", () => {
    console.log(
      "%cConnected to web socket",
      "background-color: orange; color: white;"
    );
    isSocketOpen = true;
    if (isSocketOpen && isEventListenerAdded) {
      processSendQueue();
    }
  });

  function onMessage(cb) {
    isEventListenerAdded = true;

    socket.addEventListener("message", cb);
    if (isSocketOpen && isEventListenerAdded) {
      processSendQueue();
    }
  }

  const sendQueue = [];
  const processSendQueue = () => {
    sendQueue.forEach((sendItem) => {
      send(sendItem);
    });
  };

  const applesauce = (message) => {
    if (isSocketOpen) {
      send(message);
    } else {
      sendQueue.push(message);
    }
  };

  function send(message) {
    console.log(
      `%csending message: ${message}`,
      "background-color: orange; color: white;"
    );
    const newMessage = Object.assign(message, {
      id: getUserName(),
    });
    socket.send(JSON.stringify(newMessage));
  }

  return {
    send: applesauce,
    onMessage: onMessage,
  };
}

export default WebSocketWrapper;
