import React from "react";
import PropTypes from "prop-types";
import FacedownCard from "./FacedownCard";
import { useService } from "@xstate/react";

function Partner({ partnerRef }) {
  const [state] = useService(partnerRef);
  const { cards } = state.context;
  return (
    <div className="h-48">
      Partner&apos;s hand
      <div className="flex">
        {cards.map((card, index) => {
          return <FacedownCard key={index} />;
        })}
      </div>
    </div>
  );
}

Partner.propTypes = {
  partnerRef: PropTypes.object,
};

export default Partner;
