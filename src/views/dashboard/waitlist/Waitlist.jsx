import React from "react";
import "./Waitlist.scss";
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
import WaitlistDetails from "./waitlistDetails/WaitlistDetails";

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

class Waitlist extends React.Component {
  state = {
    columns: [
      {
        name: "Name",
        selector: "name",
        sortable: true,
        cell: (row) => <p className="text-bold-500 mb-0">{row.name}</p>,
      },
      {
        name: "Email",
        selector: "email",
        sortable: true,
        cell: (row) => <p className="text-bold-500 mb-0">{row.email}</p>,
      },
      {
        name: "Phone Number",
        selector: "number",
        sortable: true,
        cell: (row) => <p className="text-bold-500 mb-0">{row.number}</p>,
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
        this.setState({ data: response.data?.filter(x => x.flag === "waitlist") });
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
          item.name?.toLowerCase().startsWith(value?.toLowerCase()) ||
          item.email?.toLowerCase().startsWith(value?.toLowerCase()) ||
          item.number?.toLowerCase().startsWith(value?.toLowerCase());
        let includesCondition =
          item.name?.toLowerCase().includes(value?.toLowerCase()) ||
          item.email?.toLowerCase().includes(value?.toLowerCase()) ||
          item.number?.toLowerCase().includes(value?.toLowerCase());

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
          <CardTitle>Wait List</CardTitle>
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
          <WaitlistDetails
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

export default Waitlist;
