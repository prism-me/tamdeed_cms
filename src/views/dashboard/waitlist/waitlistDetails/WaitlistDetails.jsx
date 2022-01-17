import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Badge, Col, Row } from "reactstrap";
import ReactStars from "react-rating-stars-component";

const WaitlistDetails = (props) => {
  let { name, email, number } = props.contact;
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          WaitList Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Row>
            <Col sm={4}>
              <h6>Name:</h6>
            </Col>
            <Col>
              <p>{name}</p>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <h6>Email:</h6>
            </Col>
            <Col>
              <p>{email}</p>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <h6>Phone Number:</h6>
            </Col>
            <Col>
              <p>{number}</p>
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

export default WaitlistDetails;
