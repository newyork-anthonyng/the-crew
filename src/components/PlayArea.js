import React from "react";
import PropTypes from "prop-types";
import { useService } from "@xstate/react";
import Card from "./Card";
import Task from "./Task";

function PlayArea({ playAreaRef }) {
  const [state, send] = useService(playAreaRef);
  const { cards, tasks } = state.context;

  const handleCardClick = (card) => {
    send({ type: "pickupCard", card });
  };

  const handleTaskClick = (task) => {
    send({ type: "pickupTask", task });
  };

  const handleDiscardCardClick = () => {
    send({ type: "discardCards" });
  };

  return (
    <div className="border border-4 border-gray-300 p-4 mb-8">
      <h1>Play area</h1>

      <div className="flex mb-4">
        {cards.map((card) => {
          return (
            <Card
              onClick={handleCardClick}
              suit={card.suit}
              rank={card.rank}
              key={`${card.rank}-${card.suit}`}
            />
          );
        })}

        <button
          type="button"
          onClick={handleDiscardCardClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Move play area cards to discard
        </button>
      </div>

      {tasks.length > 0 && (
        <div>
          <p>Assign player tasks</p>
          <div className="flex">
            {tasks.map((task) => {
              return (
                <Task
                  onClick={handleTaskClick}
                  rank={task.rank}
                  suit={task.suit}
                  key={`${task.rank}-${task.suit}`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

PlayArea.propTypes = {
  playAreaRef: PropTypes.object,
};

export default PlayArea;
