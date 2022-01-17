import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Badge, Col, Row } from "reactstrap";
import ReactStars from "react-rating-stars-component";

const BookTourDetails = (props) => {
  let { parent_name, parent_email, parent_phone, child_dob } = props.contact;
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Book Tour Details
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
              <h6>Parent/Guardian's Email:</h6>
            </Col>
            <Col>
              <p>{parent_email}</p>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <h6>Parent/Guardian's Mobile Number:</h6>
            </Col>
            <Col>
              <p>{parent_phone}</p>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <h6>Child’s Date Of Birth</h6>
            </Col>
            <Col>
              <p>{child_dob}</p>
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

export default BookTourDetails;
