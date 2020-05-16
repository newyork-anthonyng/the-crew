import React from "react";
import PropTypes from "prop-types";
import { useService } from "@xstate/react";
import Card from "./Card";

function PlayArea({ playAreaRef }) {
  const [state] = useService(playAreaRef);
  const { cards } = state.context;

  return (
    <div>
      <h1>Play area</h1>

      <div className="flex">
        {cards.map((card) => {
          return (
            <Card
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
