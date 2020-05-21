import React from "react";
import PropTypes from "prop-types";
import Card from "./Card";
import FacedownCard from "./FacedownCard";
import Task from "./Task";
import { useService } from "@xstate/react";

function Robot({ robotRef }) {
  const [state, send] = useService(robotRef);
  const { cards, tasks } = state.context;

  const handleCardClick = (card) => {
    send({ type: "playCard", card });
  };

  return (
    <div className="border border-4 border-gray-300 p-4 mb-8">
      <h1>Robot&apos;s hand</h1>

      <div className="flex mb-4">
        {cards.map((card, index) => {
          const [faceupCard, facedownCard] = card;

          return (
            <div key={index} className="relative w-32 pb-4">
              {faceupCard && (
                <div>
                  <Card
                    rank={faceupCard.rank}
                    suit={faceupCard.suit}
                    onClick={handleCardClick}
                  />
                </div>
              )}
              {facedownCard && (
                <div
                  className="absolute"
                  style={{ left: 10, top: 10, zIndex: -1 }}
                >
                  <FacedownCard />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div>
        <h2>Robot&apos;s Tasks</h2>
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
    </div>
  );
}

Robot.propTypes = {
  robotRef: PropTypes.object,
};

export default Robot;
