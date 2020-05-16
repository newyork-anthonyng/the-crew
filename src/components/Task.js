import React from "react";
import PropTypes from "prop-types";

function Task({ rank, suit }) {
  return (
    <div
      data-rank={rank}
      data-suit={suit}
      style={{ backgroundColor: suit, height: 75, width: 53 }}
      className="border-solid border border-black rounded cursor-pointer"
    >
      <span>{rank}</span>
    </div>
  );
}

Task.propTypes = {
  rank: PropTypes.string,
  suit: PropTypes.string,
};

export default Task;
