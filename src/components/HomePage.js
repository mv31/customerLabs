import React, { useState } from "react";
import SaveSegment from "./SaveSegment";
import "./common.css";
import { Button, Modal } from "react-bootstrap";

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
      <h1 className="title">Customer Labs</h1>
      <Button
        variant="outline-primary"
        onClick={(e) => {
          handlePopup(e, "open");
        }}
      >
        Save Segment
      </Button>
      <div className="custom-modal">
        <Modal
          className="centered"
          show={openSegment}
          onHide={handlePopup}
          centered
        >
          <Modal.Header className="modalHeader" closeButton>
            <Modal.Title className="">Saving Segment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SaveSegment openSegment={openSegment} handlePopup={handlePopup} />
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default HomePage;
