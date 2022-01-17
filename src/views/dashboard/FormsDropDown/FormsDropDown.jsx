import React from "react";
import "./FormsDropDown.scss";
import {
  Card,CardBody,Container,
} from "reactstrap";
import ContactList from "../contact-us/ContactList"
import BookTour from "../BookTour/BookTour"
import Waitlist from "../waitlist/Waitlist"
import CallBackRequest from "../CallBackRequest/CallBackRequest"
import {ButtonGroup, DropdownButton, Navbar, NavDropdown, Dropdown} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Select from "react-select";

const options = [
  { value: "Contact", label: "Contact List" },
  { value: "WaitList", label: "Program Wait List" },
  { value: "BookTour", label: "Book School Tour" },
  { value: "CallBackRequest", label: "Call Back Request" }
];


class FormsDropDown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: null
    };

    this.onChange = this.onChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onChange = e => {
    this.set({ [e.target.name]: e.target.value });
    console.log([e.target.value]);
  };

  handleChange = selectedOption => {
    this.setState({ selectedOption });
    console.log("Option selected: ", selectedOption);
  };

  render() {
    const { selectedOption } = this.state;
    console.log(selectedOption);
    return (
      <Card>
        <CardBody className="rdt_Wrapper">
          <fieldset>
            <div className={"selectDiv d-flex justify-content-start align-items-center"}>
              <p>Filter Queries</p>
              <div className={"SelectDiv"}>
                <Select
                  value={selectedOption}
                  onChange={this.handleChange}
                  options={options}
                  placeholder="Contact List"
                  isSearchable={options}
                />
              </div>
            </div>
          </fieldset>
          {/*<DropdownButton*/}
          {/*  as={ButtonGroup}*/}
          {/*  align={{ lg: 'end' }}*/}
          {/*  title="AGS FORMS"*/}
          {/*  id="dropdown-menu-align-responsive-1"*/}
          {/*  value={selectedOption}*/}
          {/*  options={options}*/}
          {/*  onChange={this.handleChange}*/}
          {/*>*/}
          {/*  /!*<LinkContainer to="/contact-list">*!/*/}
          {/*  <Dropdown.Item eventKey="contact-list">Contact List</Dropdown.Item>*/}
          {/*  /!*</LinkContainer>*!/*/}
          {/*  /!*<LinkContainer to="/Waitlist">*!/*/}
          {/*  <Dropdown.Item eventKey="Waitlist">Program Wait List</Dropdown.Item>*/}
          {/*  /!*</LinkContainer>*!/*/}
          {/*  /!*<LinkContainer to="/BookTour">*!/*/}
          {/*  <Dropdown.Item eventKey="BookTour">Book School Tour</Dropdown.Item>*/}
          {/*  /!*</LinkContainer>*!/*/}
          {/*  /!*<LinkContainer to="/CallBackRequest">*!/*/}
          {/*  <Dropdown.Item eventKey="CallBackRequest">Call Back Request</Dropdown.Item>*/}
          {/*  /!*</LinkContainer>*!/*/}
          {/*</DropdownButton>*/}

          {selectedOption && selectedOption.value === "Contact" ? (
            <ContactList />
          ) : selectedOption && selectedOption.value === "WaitList" ? (
            <Waitlist />
          )  : selectedOption && selectedOption.value === "BookTour" ? (
            <BookTour />
          )  : selectedOption && selectedOption.value === "CallBackRequest" ? (
            <CallBackRequest />
          ) : <ContactList />}
        </CardBody>
      </Card>
    );
  }
}

export default FormsDropDown;
