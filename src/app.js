import React from "react";
import { render } from "react-dom";
import Player from "./Player";
import "./styles.css";

function App() {
  return (
    <div>
      <Player />
    </div>
  );
}

render(<App />, document.querySelector(".js-root"));
