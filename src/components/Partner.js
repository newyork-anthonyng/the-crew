import React from "react";
import PropTypes from "prop-types";
import FacedownCard from "./FacedownCard";
import Task from "./Task";
import { useService } from "@xstate/react";

function Partner({ partnerRef }) {
  const [state] = useService(partnerRef);
  const { cards, tasks } = state.context;
  return (
    <div className="border border-4 border-gray-300 p-4 mb-8">
      Partner&apos;s hand
      <div className="flex mb-4">
        {cards.map((card, index) => {
          return (
            <div style={{ marginLeft: index === 0 ? 0 : -40 }} key={index}>
              <FacedownCard />
            </div>
          );
        })}
      </div>
      <div>
        <h2>Partner&apos;s tasks</h2>
        <div className="flex">
          {tasks.length > 0
            ? tasks.map((task) => {
                return (
                  <Task
                    rank={task.rank}
                    suit={task.suit}
                    key={`${task.rank}-${task.suit}`}
                  />
                );
              })
            : "None"}
        </div>
      </div>
    </div>
  );
}

Partner.propTypes = {
  partnerRef: PropTypes.object,
};

export default Partner;
