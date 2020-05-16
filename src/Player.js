import React from "react";
import { useService } from "@xstate/react";
import PropTypes from "prop-types";

function Player({ playerRef }) {
  const [state] = useService(playerRef);
  const { cards } = state.context;

  return (
    <div>
      <h1>Your hand</h1>
      <div className="flex">
        {cards.map((card) => {
          return (
            <div
              key={`${card.rank}-${card.suit}`}
              style={{ backgroundColor: card.suit, height: 150, width: 107 }}
              className="border-solid border border-black rounded cursor-pointer"
            >
              <span>{card.rank}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        {/* <pre>{JSON.stringify(state, null, 2)}</pre> */}
      </div>
    </div>
  );
}

Player.propTypes = {
  playerRef: PropTypes.object,
};

export default Player;
