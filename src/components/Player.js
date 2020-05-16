import React from "react";
import { useService } from "@xstate/react";
import PropTypes from "prop-types";
import Card from "./Card";
import Task from "./Task";

function Player({ playerRef }) {
  const [state, send] = useService(playerRef);
  const { cards, tasks } = state.context;

  const handleCardClick = (card) => {
    send({ type: "selectCard", card });
  };

  return (
    <div>
      <h1>Your hand</h1>
      <div className="flex h-48">
        {cards.map((card) => {
          return (
            <Card
              rank={card.rank}
              suit={card.suit}
              onClick={handleCardClick}
              key={`${card.rank}-${card.suit}`}
            />
          );
        })}
      </div>
      <div className="flex">
        {tasks.map((task) => {
          return (
            <Task
              rank={task.rank}
              suit={task.suit}
              key={`${task.rank}-${task.suit}`}
            />
          );
        })}
      </div>
    </div>
  );
}

Player.propTypes = {
  playerRef: PropTypes.object,
};

export default Player;
