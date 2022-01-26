import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    FormGroup,
    Button,
    Label,
    Col,
    Row,
    Input
} from "reactstrap";
import { useParams, useHistory } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import "./ReferenceProjectForm.scss";
import CKEditor from "ckeditor4-react";
import { ckEditorConfig } from "../../../../utils/data";
import GalleryModal from "../../gallery-modal/GalleryModal";
import { API } from "../../../../http/API";
import { UpdateTwoTone } from "@material-ui/icons";


const formSchema = Yup.object().shape({
    required: Yup.string().required("Required"),
});

const initialObj = {
    name: "",
    avatar: "",
    alt_tag : "alt"
};

const ReferenceProjectForm = (props) => {
    const history = useHistory();
    const { id } = useParams();
    const [referenceProject, setReferenceProject] = useState({ ...initialObj });
    const [isEdit, setIsEdit] = useState(false);
    const [modalShow, setModalShow] = React.useState(false);
    const [imagesData, setImagesData] = useState([]);
    const [isSingle, setIsSingle] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [isBanner, setIsBanner] = useState(false);

    //!------------Gallery--------

    useEffect(() => {
        API.get('get_all_images')
            .then((response) => {
                setImagesData(
                    response.data.data
                );

            });
    }, []);

    //******************refreshGallery Data

    const getGalleryImages = () => {
        API.get('get_all_images')
            .then((response) => {
                // debugger;
                setImagesData(
                    response.data.data
                );
            });
    }

    useEffect(() => {
        if (id && id !== "") {
            setIsEdit(true);
            API.get(`/projects/${id}`)
                .then((response) => {

                    if (response.status === 200 || response.status === 201) {
                        setReferenceProject(response.data.data);
                    }
                })
                .catch((err) => console.log(err));
        }
    }, []);

    const handleImageSelect = (e, index) => {
      // console.log(imagesData[index].alt_tag)
        if (e.target.checked) {
            if (isSingle && !isBanner) {
                setReferenceProject({
                    ...referenceProject,
                    avatar: imagesData[index].url,
                    alt_tag: imagesData[index].alt_tag
                });
                setThumbnailPreview(imagesData[index].url);
                setTimeout(() => {
                    setModalShow(false);
                }, 500);
            }
            let imagesDataUpdated = imagesData.map((x, i) => {
                if (i === index) {
                    return {
                        ...x,
                        isChecked: true,
                    };
                } else {
                    return x;
                }
            });
            setImagesData(imagesDataUpdated);
        }
    };

    //!-----------Handle Input Fields---------

    const handleFieldChange = (e) => {
      let updatedValues = { ...referenceProject };
        updatedValues[e.target.name] = e.target.value;
        setReferenceProject(updatedValues);
    }

    //!------------------Submit and Edit---------------
    const handleSubmit = () => {
        let updatedData = { ...referenceProject };

        if (isEdit) {
            let updateId = updatedData._id;
            delete updatedData["_id"];
            API.put(`/projects/${updateId}`, updatedData)
                .then((response) => {
                    if (response.status === 200 || response.status === 201) {
                        alert("Project updated successfully");
                        history.push("/ReferenceProject/list");
                    }
                })
                .catch((err) => alert("Something went wrong"));
        }
        else {
            API.post(`/projects`, referenceProject)
                .then((response) => {
                    if (response.status === 200 || response.status === 201) {
                        alert("Project added successfully");
                        history.push("/ReferenceProject/list");
                    }
                })
                .catch((err) => console.log(err));
        }
    };

    return (
        <>
            <Card className="feeding-advisor-form">
                <CardHeader>
                    <CardTitle>
                        Our Reference Project {isEdit ? "Edit" : ""} Form
                    </CardTitle>
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
                                    <Col sm={9}>
                                    <FormGroup className="mb-1">
                                        <Label for="name">Title</Label>
                                        <Field
                                            name="name"
                                            id="name"
                                            onChange={handleFieldChange}
                                            value={referenceProject.name}
                                            className={`form-control`}
                                        />
                                    </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={3}>
                                        <FormGroup className="">
                                            <Label for="avatar">Featured Image</Label>
                                            <div className="clearfix" />
                                            <div className="img-preview-wrapper">
                                                {referenceProject.avatar !== "" && (
                                                    <img src={referenceProject.avatar} alt="" className="img-fluid" />
                                                )}
                                            </div>
                                            <Button.Ripple
                                                color="primary"
                                                className="p-1"
                                                onClick={() => {
                                                    setIsSingle(true);
                                                    setIsBanner(false);
                                                    setModalShow(true);
                                                }}
                                            >
                                                Add Featured Image
                                            </Button.Ripple>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                </CardBody>
                <GalleryModal
                    open={modalShow}
                    handleClose={() => setModalShow(false)}
                    handleImageSelect={handleImageSelect}
                    data={imagesData}
                    refreshData={getGalleryImages}
                />
            </Card>

            <Card>
                <CardBody>
                    {/* //!----------Submit Button--------------- */}
                    <Button.Ripple
                        onClick={handleSubmit}
                        color="primary"
                        type="submit"
                        className="mt-2"
                    >
                        {isEdit ? "Edit" : "Add"}
                    </Button.Ripple>
                </CardBody>
            </Card>
        </>
    );
};

export default ReferenceProjectForm;
