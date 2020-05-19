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

  const handleTaskClick = (task) => {
    send({ type: "returnTask", task });
  };

  return (
    <div className="border border-4 border-gray-300 mb-16 p-4">
      <h1>Your hand</h1>
      <div className="flex mb-4">
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
      <div>
        <h2>Your tasks</h2>
        <div className="flex">
          {tasks.length > 0
            ? tasks.map((task) => {
                return (
                  <Task
                    onClick={handleTaskClick}
                    rank={task.rank}
                    suit={task.suit}
                    key={`${task.rank}-${task.suit}`}
                  />
                );
              })
            : "None"}
        </div>
      </div>
    </div>
  );
}

Player.propTypes = {
  playerRef: PropTypes.object,
};

export default Player;
