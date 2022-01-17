import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    FormGroup,
    Button,
    Label,
    Input,
    Row,
    Col
} from "reactstrap";
import { useHistory, useParams } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import "./EventsForm.scss";
import { API } from "../../../../http/API";
import { withRouter } from "react-router-dom";

const formSchema = Yup.object().shape({
    required: Yup.string().required("Required"),
});

const initialObj = {
    name: "",
    date: "",
    enddate: "",
    term: "",
    arabic: {
        name: "",
    },
};

const EventsForm = (props) => {
    const history = useHistory();
    const { id } = useParams();
    const [isEdit, setIsEdit] = useState(false);
    const [videoData, setVideoData] = useState({ ...initialObj });


    //!-----------Call Api for Edit--------------
    useEffect(() => {
        if (id && id !== "") {
            setIsEdit(true);
            API.get(`/events/${id}`)
                .then((response) => {
                    // debugger;
                    if (response.status === 200 || response.status === 201) {
                        setVideoData(response.data.data);
                    }
                })
                .catch((err) => console.log(err));
        }
    }, [id]);

    //!------------Handle Input Fields-------
    const handleFieldChange = (e) => {
        let updatedVideo = { ...videoData };
        updatedVideo[e.target.name] = e.target.value;
        setVideoData(updatedVideo);
    };

    //!------------Handle Arabic Fields-------
    const handleArabicFieldChange = (e) => {
        let updatedVideo = { ...videoData };
        updatedVideo.arabic[e.target.name] = e.target.value;
        setVideoData(updatedVideo);
    };

    //!------------------Submit and Edit---------------
    const handleSubmit = () => {
        if (isEdit) {
            let updateId = videoData._id;
            delete videoData["_id"];
            API.put(`/events/${updateId}`, videoData)
                .then((res) => {
                    if (res.status === 200 || res.status === 201) {
                        alert("Item updated successfully");
                        history.push("/Events/list");
                    }
                })
                .catch((err) => alert("Something went wrong"));
        } else {
            API.post(`/events`, videoData)
                .then((response) => {
                    if (response.status === 200 || response.status === 201) {
                        alert("Item added successfully");
                        // console.log(response.data);
                        history.push("/Events/list");
                    }
                })
                .catch((err) => alert("Something went wrong"));
        }
    };

    return (
        <>
            <Card className="category-add-form">
                <CardHeader>
                    <CardTitle> Events {isEdit ? "Edit" : "Add"} Form</CardTitle>
                </CardHeader>
                <CardBody>
                    <Formik
                        initialValues={{
                            required: "",
                        }}
                        validationSchema={formSchema}
                    >
                        {({ errors, touched }) => (
                            <Form>
                                <Row>
                                    <Col sm={6}>
                                        <FormGroup className="mb-1">
                                            <Label for="date">Start Date</Label>
                                            <Field
                                                name="date"
                                                id="date"
                                                onChange={handleFieldChange}
                                                value={videoData.date}
                                                className={`form-control`}
                                                type="date"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col sm={6}>
                                        <FormGroup className="mb-1">
                                            <Label for="enddate">End Date</Label>
                                            <Field
                                                name="enddate"
                                                id="enddate"
                                                onChange={handleFieldChange}
                                                value={videoData.enddate}
                                                className={`form-control`}
                                                type="date"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <FormGroup className="mb-1">
                                    <Label for="name">Event</Label>
                                    <Field
                                        name="name"
                                        id="name"
                                        onChange={handleFieldChange}
                                        value={videoData.name}
                                        className={`form-control`}
                                    />
                                </FormGroup>
                                <FormGroup className="mb-1">
                                    <Label for="term">Term</Label>
                                    <Field
                                        name="term"
                                        id="term"
                                        onChange={handleFieldChange}
                                        value={videoData.term}
                                        className={`form-control`}
                                    />
                                </FormGroup>
                            </Form>
                        )}
                    </Formik>
                </CardBody>
            </Card>

            {/* *********************
      ARABIC VERSION FIELDS
      ********************* */}
            {isEdit && (
                // <Card style={{ background: '#f0f0f0', boxShadow: `0px 4px 25px 0px rgba(230, 85, 80, 0.4)` }}>
                <Card style={{ background: "rgba(230,85,80,.15)" }}>
                    <CardBody>
                        <div className="arabic-form">
                            <h3>Arabic Fields</h3>
                            <Formik
                                initialValues={{
                                    required: "",
                                    email: "",
                                    video_link: "",
                                    number: "",
                                    date: "",
                                    minlength: "",
                                    maxlength: "",
                                }}
                                validationSchema={formSchema}
                            >
                                {({ errors, touched }) => (
                                    <Form>
                                        <FormGroup className="mb-1">
                                            <Label for="name">Event</Label>
                                            <Field
                                                name="name"
                                                id="name"
                                                onChange={handleArabicFieldChange}
                                                value={videoData.arabic?.name}
                                                className={`form-control`}
                                            />
                                        </FormGroup>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </CardBody>
                </Card>
            )}

            <Card>
                <CardBody>
                    {/* //!----------Submit Button--------------- */}
                    <Button.Ripple
                        onClick={handleSubmit}
                        color="primary"
                        type="submit"
                        className="mt-2"
                    >
                        {isEdit ? "Update" : "Add"}
                    </Button.Ripple>
                </CardBody>
            </Card>
        </>
    );
};

export default withRouter(EventsForm);
