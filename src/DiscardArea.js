import React from "react";
import PropTypes from "prop-types";
import FacedownCard from "./FacedownCard";
import { useService } from "@xstate/react";

function DiscardArea({ discardAreaRef }) {
  const [state] = useService(discardAreaRef);
  const { cards } = state.context;

  return (
    <div>
      <h1>Discard Area</h1>

      <div className="relative">
        {cards.map((card, index) => {
          return (
            <FacedownCard
              style={{ left: index * 10, top: index * 10 }}
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
