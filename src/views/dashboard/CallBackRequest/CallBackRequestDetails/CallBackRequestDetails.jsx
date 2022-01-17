import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Badge, Col, Row } from "reactstrap";
import ReactStars from "react-rating-stars-component";

const CallBackRequestDetails = (props) => {
  let { parent_name, phone } = props.contact;
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Call Back Request Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Row>
            <Col sm={4}>
              <h6>Parent/Guardian's Name:</h6>
            </Col>
            <Col>
              <p>{parent_name}</p>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <h6>Parent/Guardian's Mobile Number:</h6>
            </Col>
            <Col>
              <p>{phone}</p>
            </Col>
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CallBackRequestDetails;
