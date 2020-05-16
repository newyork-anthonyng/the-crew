import React from "react";
import PropTypes from "prop-types";
import Card from "./Card";
import FacedownCard from "./FacedownCard";
import { useService } from "@xstate/react";

function Robot({ robotRef }) {
  const [state, send] = useService(robotRef);
  const { cards } = state.context;

  const handleCardClick = (card) => {
    send({ type: "playCard", card });
  };

  return (
    <div>
      <h1>Robot&apos;s hande</h1>

      <div className="h-48 flex">
        {cards.map((card, index) => {
          const [faceupCard, facedownCard] = card;

          return (
            <div key={index} className="relative w-32">
              {facedownCard && (
                <div className="absolute" style={{ left: 10, top: 10 }}>
                  <FacedownCard />
                </div>
              )}
              {faceupCard && (
                <div className="absolute">
                  <Card
                    rank={faceupCard.rank}
                    suit={faceupCard.suit}
                    onClick={handleCardClick}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

Robot.propTypes = {
  robotRef: PropTypes.object,
};

export default Robot;
