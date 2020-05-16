import React from "react";
import PropTypes from "prop-types";

function Card({ onClick, rank, suit }) {
  const handleClick = () => {
    onClick({ rank, suit });
  };
  return (
    <div
      onClick={handleClick}
      data-rank={rank}
      data-suit={suit}
      style={{ backgroundColor: suit, height: 150, width: 107 }}
      className="border-solid border border-black rounded cursor-pointer"
    >
      <span>{rank}</span>
    </div>
  );
}

Card.propTypes = {
  onClick: PropTypes.func,
  rank: PropTypes.string,
  suit: PropTypes.string,
};

Card.defaultProps = {
  onClick: () => {},
};

export default Card;
