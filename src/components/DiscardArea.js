import React from "react";
import PropTypes from "prop-types";
import DiscardCard from "./DiscardCard";
import { useService } from "@xstate/react";

function DiscardArea({ discardAreaRef }) {
  const [state] = useService(discardAreaRef);
  const { cards } = state.context;

  return (
    <div className="border border-4 border-gray-300 p-4 mb-8">
      <h1>Discard Area</h1>

      <div className="flex">
        {cards.map((card, index) => {
          return (
            <DiscardCard
              style={{ marginLeft: index === 0 ? 0 : -40 }}
              key={`${card.rank}-${card.suit}`}
            />
          );
        })}
      </div>
    </div>
  );
}

DiscardArea.propTypes = {
  discardAreaRef: PropTypes.object,
};

export default DiscardArea;
