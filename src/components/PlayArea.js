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

  const handleDiscardCardClick = () => {
    send({ type: "discardCards" });
  };

  return (
    <div>
      <h1>Play area</h1>

      <div className="flex h-48">
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

      <button
        type="button"
        onClick={handleDiscardCardClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Move play area cards to discard
      </button>
    </div>
  );
}

PlayArea.propTypes = {
  playAreaRef: PropTypes.object,
};

export default PlayArea;
