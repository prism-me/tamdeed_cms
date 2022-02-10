import React from "react";
import "./UserQueryList.scss";
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
import { MdDelete, MdEdit ,MdMail } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { API } from "../../../../http/API";

class UserQueryList extends React.Component {
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
                name: "Subject",
                selector: "subject",
                sortable: true,
                cell: (row) => <p className="text-bold-500 mb-0">{row.subject}</p>,
            },
            {
                name: "Actions",
                selector: "_id",
                sortable: true,
                cell: (row) => (
                    <p className="text-bold-500 mb-0">
                        {/* <FaEye size={20} className="action-icon-details" /> */}
                        <MdMail
                            size={20}
                            style={{
                                color: "#1A2C52 ",
                            }}
                            onClick={() => {
                                window.location = `mailto:${row.email}`;
                            }}
                            className="action-icon-edit"
                        />
                        <MdEdit
                            size={20}
                            style={{
                                color: "#1A2C52 ",
                            }}
                            onClick={() => {
                                this.props.history.push(`/user/queries/edit/${row._id}`);
                            }}
                            className="action-icon-edit"
                        />
                        <MdDelete
                            size={20}
                            className="action-icon-delete"
                            onClick={() => {
                                if (window.confirm("Are you sure to delete this item?")) {
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
        this.getIndustries();
    }

    getIndustries = () => {
        API.get("/contacts")
            .then((response) => {
                // console.log("Mentor response", response.data.data);
                this.setState({ data: response.data.data });
            })
            .catch();
    };

    handleDelete = (id) => {
        API.delete(`/delete-contact/${id}`)
            .then((response) => {
                // alert("Mentor deleted successfully");
                this.getIndustries();
            })
            .catch((err) => console.log(err));
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
                    item.size?.toLowerCase().startsWith(value?.toLowerCase()) ||
                    item.description
                        ?.toLowerCase()
                        .startsWith(value?.toLowerCase())
                    // item.long_description
                    // ?.toLowerCase()
                    // .startsWith(value?.toLowerCase()) ||
                    // item.category?.toLowerCase().startsWith(value?.toLowerCase()) ||
                    // item.material?.toLowerCase().startsWith(value?.toLowerCase())
                    ;
                let includesCondition =
                    item.name?.toLowerCase().includes(value?.toLowerCase()) ||
                    item.date?.toLowerCase().includes(value?.toLowerCase()) ||
                    item.size?.toLowerCase().startsWith(value?.toLowerCase()) ||
                    item.description
                        ?.toLowerCase()
                        .startsWith(value?.toLowerCase())
                    // item.long_description
                    // ?.toLowerCase()
                    // .startsWith(value?.toLowerCase()) ||
                    // item.category?.toLowerCase().startsWith(value?.toLowerCase()) ||
                    // item.material?.toLowerCase().includes(value?.toLowerCase())
                    ;

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
                    <CardTitle>Partners</CardTitle>
                </CardHeader>
                <CardBody className="rdt_Wrapper">
                    <DataTable
                        className="dataTable-custom"
                        data={value.length ? filteredData : data}
                        columns={columns}
                        noHeader
                        pagination
                        subHeader
                        
                    />
                </CardBody>
            </Card>
        );
    }
}

export default UserQueryList;
