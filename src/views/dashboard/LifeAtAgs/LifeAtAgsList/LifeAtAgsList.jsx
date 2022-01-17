import React from "react";
import "./LifeAtAgsList.scss";
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
                    onClick={() => props.history.push("/LifeAtAgs/form")}
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

class LifeAtAgsList extends React.Component {
    state = {
        columns: [
            {
                name: "Image",
                selector: "Image",
                sortable: true,
                cell: (row) =>
                    <div className="user-img ml-xl-0 ml-2">
                        {row.thumbnail?.startsWith("http") ? (
                            <img
                                className="img-fluid rounded-circle"
                                height="36"
                                width="36"
                                src={row.thumbnail}
                                alt={row.thumbnail}
                            />
                        ) : null}
                    </div>,
            },
            {
                name: "Title",
                selector: "title",
                sortable: true,
                cell: (row) => <p className="text-bold-500 mb-0">{row.title}</p>,
            },

            {
                name: "Video Link",
                selector: "video_link",
                sortable: true,
                cell: (row) => <p className="text-bold-500 mb-0">{row.video_link}</p>,
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
                                this.props.history.push(`/LifeAtAgs/form/edit/${row._id}`);
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
                                if (window.confirm("Are you sure to delete this video?")) {
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
        API.get("/exp_and_life")
            .then((response) => {
                this.setState({
                    data: response.data.data.filter(x => x.type === "life-at-ags"),
                });
            })
            .catch();
    };

    handleDelete = (id) => {
        API.delete(`/exp_and_life/${id}`)
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
                    item.title?.toLowerCase().startsWith(value?.toLowerCase()) ||
                    item.video_link?.toLowerCase().startsWith(value?.toLowerCase()) ||
                    item.size?.toLowerCase().startsWith(value?.toLowerCase());

                let includesCondition =
                    item.title?.toLowerCase().includes(value?.toLowerCase()) ||
                    item.video_link?.toLowerCase().includes(value?.toLowerCase()) ||
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
                    <CardTitle>Life at Ags List</CardTitle>
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

export default LifeAtAgsList;
