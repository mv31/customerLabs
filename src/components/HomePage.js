import React, { useState } from "react";
import SaveSegment from "./SaveSegment";
import "./common.css"

const HomePage = () => {
  const [openSegment, setOpenSegment] = useState(false);

  const handlePopup = (e, func) => {
    e?.preventDefault();
    if (func === "open") {
      setOpenSegment(true);
    } else {
      setOpenSegment(false);
    }
  };

  return (
    <div className="homeContainer">
      <h1>Customer Labs</h1>
      <button
        onClick={(e) => {
          handlePopup(e, "open");
        }}
      >
        Save Segment
      </button>

      {openSegment && (
        <div>
          <h1>popup</h1>
          <SaveSegment openSegment={openSegment} handlePopup={handlePopup} />
        </div>
      )}
    </div>
  );
};

export default HomePage;
