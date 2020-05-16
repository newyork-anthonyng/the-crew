import React from "react";
import PropTypes from "prop-types";
import Card from "./Card";
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

      <div className="h-48">
        {cards.map((card) => {
          return (
            <Card
              key={`${card.rank}-${card.suit}`}
              rank={card.rank}
              suit={card.suit}
              onClick={handleCardClick}
            />
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
