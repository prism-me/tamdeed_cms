import React from "react";
import "./EventsList.scss";
import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Input,
    Button,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { Search } from "react-feather";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { API } from "../../../../http/API";

const CustomHeader = (props) => {
    return (
        <div className="d-flex flex-wrap justify-content-between">
            <div className="add-new">
                <Button.Ripple
                    color="primary"
                    onClick={() => props.history.push("/Events/form")}
                >
                    Add New
                </Button.Ripple>
            </div>
            <div className="position-relative has-icon-left mb-1">
                <Input value={props.value} onChange={(e) => props.handleFilter(e)} />
                <div className="form-control-position">
                    <Search size="15" />
                </div>
            </div>
        </div>
    );
};

class EventsList extends React.Component {
    state = {
        columns: [
            {
                name: "Event",
                selector: "name",
                sortable: true,
                cell: (row) => <p className="text-bold-500 mb-0">{row.name}</p>,
            },

            {
                name: "Start Date",
                selector: "date",
                sortable: true,
                cell: (row) => <p className="text-bold-500 mb-0">{row.date}</p>,
            },

            {
                name: "End Date",
                selector: "enddate",
                sortable: true,
                cell: (row) => <p className="text-bold-500 mb-0">{row.enddate}</p>,
            },

            {
                name: "Actions",
                selector: "_id",
                sortable: true,
                cell: (row) => (
                    <p className="text-bold-500 mb-0">
                        {/* <FaEye size={20} className="action-icon-details" /> */}
                        <MdEdit
                            size={20}
                            style={{
                                color: "#1A2C52 ",
                            }}
                            onClick={() => {
                                this.props.history.push(`/Events/form/edit/${row._id}`);
                            }}
                            className="action-icon-edit"
                        />
                        <MdDelete
                            size={20}
                            className="action-icon-delete"
                            style={{
                                color: "#1A2C52",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                if (window.confirm("Are you sure to delete this Event?")) {
                                    this.handleDelete(row._id);
                                }
                            }}
                        />
                    </p>
                ),
            },
        ],

        data: [],
        filteredData: [],
        value: "",
    };
    componentDidMount() {
        this.getVideosList();
    }

    getVideosList = () => {
        API.get("/events")
            .then((response) => {
                this.setState({
                    data: response.data.data,
                });
            })
            .catch();
    };

    handleDelete = (id) => {
        API.delete(`/events/${id}`)
            .then((response) => {
                // alert("Video deleted successfully");
                this.getVideosList();
            })
            .catch();
    };

    handleFilter = (e) => {
        let value = e.target.value;
        let data = this.state.data;
        let filteredData = this.state.filteredData;
        this.setState({ value });

        if (value.length) {
            filteredData = data.filter((item) => {
                let startsWithCondition =
                    item.name?.toLowerCase().startsWith(value?.toLowerCase()) ||
                    item.date?.toLowerCase().startsWith(value?.toLowerCase()) ||
                    item.enddate?.toLowerCase().startsWith(value?.toLowerCase()) ||
                    item.size?.toLowerCase().startsWith(value?.toLowerCase());

                let includesCondition =
                    item.name?.toLowerCase().includes(value?.toLowerCase()) ||
                    item.date?.toLowerCase().includes(value?.toLowerCase()) ||
                    item.enddate?.toLowerCase().includes(value?.toLowerCase()) ||
                    item.size?.toLowerCase().startsWith(value?.toLowerCase());

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
                    <CardTitle>Events List</CardTitle>
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
                </CardBody>
            </Card>
        );
    }
}

export default EventsList;
