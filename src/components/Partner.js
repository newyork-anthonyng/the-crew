import React from "react";
import PropTypes from "prop-types";
import FacedownCard from "./FacedownCard";
import Task from "./Task";
import { useService } from "@xstate/react";

function Partner({ partnerRef }) {
  const [state] = useService(partnerRef);
  const { cards, tasks } = state.context;
  return (
    <div className="border-dashed border-4 border-gray-300">
      Partner&apos;s hand
      <div className="flex">
        {cards.map((card, index) => {
          return <FacedownCard key={index} />;
        })}
      </div>
      <div>
        <h2>Partner&apos;s tasks</h2>
        <div className="flex">
          {tasks.map((task) => {
            return (
              <Task
                rank={task.rank}
                suit={task.suit}
                key={`${task.rank}-${task.suit}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

Partner.propTypes = {
  partnerRef: PropTypes.object,
};

export default Partner;
