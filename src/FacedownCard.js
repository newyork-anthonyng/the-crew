import React from "react";
import PropTypes from "prop-types";

function FacedownCard({ style }) {
  const cardStyle = Object.assign(
    {
      height: 150,
      width: 107,
    },
    style
  );
  return (
    <div
      style={cardStyle}
      className="border-solid border border-black rounded bg-gray-700 absolute"
    ></div>
  );
}

FacedownCard.propTypes = {
  style: PropTypes.object,
};

export default FacedownCard;
