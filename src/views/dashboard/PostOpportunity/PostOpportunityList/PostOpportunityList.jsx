import React from "react";
import "./PostOpportunityList.scss";
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
                    onClick={() => props.history.push("/post-opportunity/form")}
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

class PostOpportunityList extends React.Component {
    state = {
        columns: [
            {
                name: "Designation",
                selector: "designation",
                sortable: true,
                cell: (row) => <p className="text-bold-500 mb-0">{row.designation}</p>,
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
                                this.props.history.push(`/post-opportunity/form/edit/${row._id}`);
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
                                if (window.confirm("Are you sure to delete this Post?")) {
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
        this.getJobOpportunityList();
    }

    getJobOpportunityList = () => {
        API.get("/career")
            .then((response) => {
                this.setState({
                    data: response.data.data,
                });
            })
            .catch();
    };

    handleDelete = (id) => {
        API.delete(`/career/${id}`)
            .then((response) => {
                // alert("Video deleted successfully");
                this.getJobOpportunityList();
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
                let startsWithCondition = item.designation?.toLowerCase().startsWith(value?.toLowerCase());

                let includesCondition = item.designation?.toLowerCase().includes(value?.toLowerCase());

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
                    <CardTitle>Job Opportunity List</CardTitle>
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

export default PostOpportunityList;
