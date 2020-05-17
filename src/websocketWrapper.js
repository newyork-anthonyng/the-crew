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

  const processSendQueue = () => {
    this.send = send;
    sendQueue.forEach((sendItem) => {
      this.send(sendItem);
    });
  };

  const sendQueue = [];
  function notLoadedSend(message) {
    sendQueue.push(message);
  }

  function send(message) {
    console.log(
      `%csending message: ${message}`,
      "background-color: orange; color: white;"
    );
    socket.send(JSON.stringify(message));
  }

  return {
    send: notLoadedSend,
    onMessage: onMessage,
  };
}

export default WebSocketWrapper;
