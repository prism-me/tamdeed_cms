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
import "./PostOpportunityForm.scss";
import { API } from "../../../../http/API";
import { withRouter } from "react-router-dom";
import { ckEditorConfig } from "../../../../utils/data";
import CKEditor from "ckeditor4-react";


const formSchema = Yup.object().shape({
    required: Yup.string().required("Required"),
});

const initialObj = {
    designation: "",
    description: "",
    arabic: {
        description: "",
    },
};

const PostOpportunityForm = (props) => {
    const history = useHistory();
    const { id } = useParams();
    const [isEdit, setIsEdit] = useState(false);
    const [jobData, setJobData] = useState({ ...initialObj });


    //!-----------Call Api for Edit--------------
    useEffect(() => {
        if (id && id !== "") {
            setIsEdit(true);
            API.get(`/jobs/${id}`)
                .then((response) => {
                    // debugger;
                    if (response.status === 200 || response.status === 201) {
                        setJobData(response.data.data);
                    }
                })
                .catch((err) => console.log(err));
        }
    }, [id]);

    //!------------Handle Input Fields-------
    const handleFieldChange = (e) => {
        let updatedJob = { ...jobData };
        updatedJob[e.target.name] = e.target.value;
        setJobData(updatedJob);
    };

    //!------------Handle Arabic Fields-------
    const handleArabicFieldChange = (e) => {
        let updatedJob = { ...jobData };
        updatedJob.arabic[e.target.name] = e.target.value;
        setJobData(updatedJob);
    };

    //!------------------Submit and Edit---------------
    const handleSubmit = () => {
        if (isEdit) {
            let updateId = jobData._id;
            delete jobData["_id"];
            API.put(`/jobs/${updateId}`, jobData)
                .then((res) => {
                    if (res.status === 200 || res.status === 201) {
                        alert("Item updated successfully");
                        history.push("/post-opportunity/list");
                    }
                })
                .catch((err) => alert("Something went wrong"));
        } else {
            API.post(`/jobs`, jobData)
                .then((response) => {
                    if (response.status === 200 || response.status === 201) {
                        alert("Item added successfully");
                        // console.log(response.data);
                        history.push("/post-opportunity/list");
                    }
                })
                .catch((err) => alert("Something went wrong"));
        }
    };

    return (
        <>
            <Card className="category-add-form">
                <CardHeader>
                    <CardTitle> Job Opportunity {isEdit ? "Edit" : "Add"} Form</CardTitle>
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
                                    <Col sm={12}>
                                        <FormGroup className="mb-1">
                                            <Label for="designation">Designation</Label>
                                            <Field
                                                name="designation"
                                                id="designation"
                                                onChange={handleFieldChange}
                                                value={jobData.designation}
                                                className={`form-control`}
                                                type="text"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <FormGroup className="mb-1">
                                    <Label for="description">Job Description</Label>
                                    <Input
                                            name="decription"
                                            id="decription"
                                            onChange={handleFieldChange}
                                            value={jobData.decription}
                                            className={`form-control`}
                                            type="textarea"
                                            rows="10"
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
            { false && isEdit && (
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
                                <Form>
                                    <FormGroup className="mb-1">
                                        <Label for="name">Designation</Label>
                                        <CKEditor
                                            config={ckEditorConfig}
                                            onBeforeLoad={(CKEDITOR) =>
                                                (CKEDITOR.disableAutoInline = true)
                                            }
                                            data={jobData.arabic.description || ""}
                                            onChange={(e) => {
                                                setJobData({
                                                    ...jobData,
                                                    arabic: {
                                                        ...jobData.arabic,
                                                        description: e.editor.getData(),
                                                    },
                                                });
                                            }}
                                        />
                                        
                                    </FormGroup>
                                </Form>
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

export default withRouter(PostOpportunityForm);
