import React from "react";
import PropTypes from "prop-types";
import { useService } from "@xstate/react";
import Card from "./Card";

function PlayArea({ playAreaRef }) {
  const [state, send] = useService(playAreaRef);
  const { cards } = state.context;

  const handleCardClick = (card) => {
    send({ type: "pickupCard", card });
  };

  return (
    <div>
      <h1>Play area</h1>

      <div className="flex">
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
      </div>
    </div>
  );
}

PlayArea.propTypes = {
  playAreaRef: PropTypes.object,
};

export default PlayArea;
