import React from "react";
import "./BookTour.scss";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Input,
  Button,
} from "reactstrap";
import ReactStars from "react-rating-stars-component";

import DataTable from "react-data-table-component";
import { Star, Search } from "react-feather";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { API } from "../../../http/API";
import axios from "axios";
import BookTourDetails from "./BookTourDetails/BookTourDetails";

const CustomHeader = (props) => {
  return (
    <div className="d-flex flex-wrap justify-content-between">
      <div className="add-new"></div>
      <div className="position-relative has-icon-left mb-1">
        <Input value={props.value} onChange={(e) => props.handleFilter(e)} />
        <div className="form-control-position">
          <Search size="15" />
        </div>
      </div>
    </div>
  );
};

class BookTour extends React.Component {
  state = {
    columns: [
      {
        name: "Parent/Guardian's Name",
        selector: "parent_name",
        sortable: true,
        cell: (row) => <p className="text-bold-500 mb-0">{row.parent_name}</p>,
      },
      {
        name: "Parent/Guardian's Email",
        selector: "parent_email",
        sortable: true,
        cell: (row) => <p className="text-bold-500 mb-0">{row.parent_email}</p>,
      },
      {
        name: "Parent/Guardian's Phone",
        selector: "parent_phone",
        sortable: true,
        cell: (row) => <p className="text-bold-500 mb-0">{row.parent_phone}</p>,
      },

      {
        name: "Child’s Date Of Birth",
        selector: "child_dob",
        sortable: true,
        cell: (row) => <p className="text-bold-500 mb-0">{row.child_dob}</p>,
      },
      {
        name: "Actions",
        selector: "_id",
        sortable: true,
        cell: (row) => (
          <div className="d-flex justify-content-between">
            <FaEye
              size={20}
              onClick={() => {

                this.setState({ selectContact: row });
                this.setState({ show: true });
              }}
              className="action-icon-details"
            />

            {/* <MdDelete size={20} className="action-icon-delete" /> */}
          </div>
        ),
      },
    ],

    data: [],
    filteredData: [],
    value: "",
    show: false,
    onHide: false,
    selectContact: "",
  };

  handleGetApi = () => {
    API.get("/get_all_queries")
      .then((response) => {
        this.setState({ data: response.data?.filter(x => x.flag === "book_school_tour") });
      })
      .catch((err) =>
        alert("Something went wrong, Please check your connection")
      );
  };

  componentDidMount() {
    this.handleGetApi();
  }

  handleFilter = (e) => {
    let value = e.target.value;
    let data = this.state.data;
    let filteredData = this.state.filteredData;
    this.setState({ value });

    if (value.length) {
      filteredData = data.filter((item) => {
        let startsWithCondition =
          item.parent_name?.toLowerCase().startsWith(value?.toLowerCase()) ||
          item.parent_email?.toLowerCase().startsWith(value?.toLowerCase()) ||
          item.child_dob?.toLowerCase().startsWith(value?.toLowerCase()) ||
          item.parent_phone?.toLowerCase().startsWith(value?.toLowerCase());
        let includesCondition =
          item.parent_name?.toLowerCase().includes(value?.toLowerCase()) ||
          item.parent_email?.toLowerCase().includes(value?.toLowerCase()) ||
          item.child_dob?.toLowerCase().includes(value?.toLowerCase()) ||
          item.parent_phone?.toLowerCase().startsWith(value?.toLowerCase());

        if (startsWithCondition) {
          return startsWithCondition;
        } else if (!startsWithCondition && includesCondition) {
          return includesCondition;
        } else return null;
      });
      this.setState({ filteredData });
    }
  };

  render() {
    let { data, columns, value, filteredData } = this.state;
    return (
      <Card>
        <CardHeader>
          <CardTitle>Book Tour List</CardTitle>
        </CardHeader>
        <CardBody className="rdt_Wrapper">
          <DataTable
            className="dataTable-custom"
            data={value.length ? filteredData : data}
            columns={columns}
            noHeader
            pagination
            subHeader
            subHeaderComponent={
              <CustomHeader
                value={value}
                handleFilter={this.handleFilter}
                {...this.props}
              />
            }
          />
          <BookTourDetails
            show={this.state.show}
            onHide={() => {
              this.setState({ show: false });
            }}
            contact={this.state.selectContact}
          />
        </CardBody>
      </Card>
    );
  }
}

export default BookTour;
