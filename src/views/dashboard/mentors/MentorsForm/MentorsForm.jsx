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
} from "reactstrap";
import { useParams, useHistory } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import "./MentorsForm.scss";
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
    description: "",
    avatar: "",
    designation: "web",
    alt_tag: "mentor",
    route: "",
    arabic: {
        name: "",
        description: "",
    },
};

const MentorsForm = (props) => {
    const history = useHistory();
    const { id } = useParams();
    const [mentors, setMentors] = useState({ ...initialObj });
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

    //!--------Call Article_category Api for Edit----
    useEffect(() => {
        if (id && id !== "") {
            setIsEdit(true);
            API.get(`/mentors/${id}`)
                .then((response) => {
                    // debugger;
                    if (!response.data.data.arabic) {
                        response.data.data.arabic = initialObj.arabic;
                    }
                    if (response.status === 200 || response.status === 201) {
                        setMentors(response.data.data);
                        // console.log(mentors);
                    }
                })
                .catch((err) => console.log(err));
        }
    }, []);

    useEffect(
        () => {
            setMentors({
                ...mentors,
                route: mentors.name.replace(/\s+/g, "-").toLocaleLowerCase(),
            });
        },
        isEdit ? [] : [mentors.name]
    );

    const handleImageSelect = (e, index) => {
        if (e.target.checked) {
            if (isSingle && !isBanner) {
                setMentors({
                    ...mentors,
                    avatar: imagesData[index].url,
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
        let updatedValues = { ...mentors };
        updatedValues[e.target.name] = e.target.value;
        setMentors(updatedValues);
    };
    //! Handle Arbic OnChnage
    const handleArabicOnChange = (e) => {
        // debugger;
        let updatedValue = { ...mentors };
        updatedValue.arabic[e.target.name] = e.target.value;
        setMentors(updatedValue);
    };
    //! ***Handle Arabic Editor***
    const handleArabicEditor = (value) => {
        // debugger;
        let updatedValue = { ...mentors };
        updatedValue.arabic.description = value;
        setMentors(updatedValue);
    };

    //!------------------Submit and Edit---------------
    const handleSubmit = () => {
        let updatedData = { ...mentors };
        // updatedData.arabic.featured_img = updatedData.featured_img;
        if (isEdit) {
            let updateId = updatedData.route;
            delete updatedData["_id"];
            API.put(`/mentors/${updateId}`, updatedData)
                .then((response) => {
                    if (response.status === 200 || response.status === 201) {
                        alert("Mentors updated successfully");
                        history.push("/Mentors/list");
                    }
                })
                .catch((err) => alert("Something went wrong"));
        }
        else {
            API.post(`/mentors`, mentors)
                .then((response) => {
                    if (response.status === 200 || response.status === 201) {
                        alert("Mentors added successfully");
                        history.push("/Mentors/list");
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
                        Meet Mentors {isEdit ? "Edit" : ""} Form
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
                                <FormGroup className="mb-1">
                                    <Label for="name">Title</Label>
                                    <Field
                                        name="name"
                                        id="name"
                                        onChange={handleFieldChange}
                                        value={mentors.name}
                                        className={`form-control`}
                                    />
                                </FormGroup>
                                <Row>
                                    <Col sm={9}>
                                        <div>
                                            <Label for="infoText">Sub-Title</Label>
                                            <CKEditor
                                                config={ckEditorConfig}
                                                onBeforeLoad={(CKEDITOR) =>
                                                    (CKEDITOR.disableAutoInline = true)
                                                }
                                                data={mentors.description}
                                                onChange={(e) =>
                                                    setMentors({
                                                        ...mentors,
                                                        description: e.editor.getData(),
                                                    })
                                                }
                                            />
                                        </div>
                                    </Col>
                                    <Col sm={3}>
                                        <FormGroup className="">
                                            <Label for="avatar">Featured Image</Label>
                                            <div className="clearfix" />
                                            <div className="img-preview-wrapper">
                                                {mentors.avatar !== "" && (
                                                    <img src={mentors.avatar} alt="" className="img-fluid" />
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
                                <FormGroup className="mb-1">
                                    <Label for="route">Route</Label>
                                    <Field
                                        name="route"
                                        id="route"
                                        onChange={handleFieldChange}
                                        value={mentors.route}
                                        className={`form-control`}
                                    />
                                </FormGroup>
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
            {/* //!--------Arabic Version---------- */}

            {isEdit && (

                <Card className="feeding-advisor-arabic-form">
                    <CardHeader>
                        <CardTitle>Arabic Form</CardTitle>
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
                                    <FormGroup className="mb-1">
                                        <Label for="name">Title</Label>
                                        <Field
                                            name="name"
                                            id="name"
                                            value={mentors?.arabic?.name}
                                            onChange={handleArabicOnChange}
                                            className={`form-control`}
                                        />
                                    </FormGroup>

                                    <Row>
                                        <Col sm={12}>
                                            <div>
                                                <Label for="infoText">Sub-Title</Label>
                                                <CKEditor
                                                    config={ckEditorConfig}
                                                    onBeforeLoad={(CKEDITOR) =>
                                                        (CKEDITOR.disableAutoInline = true)
                                                    }
                                                    data={mentors?.arabic?.description}
                                                    onChange={(e) => handleArabicEditor(e.editor.getData())}
                                                />
                                            </div>
                                        </Col>
                                    </Row>

                                    {/* <Button.Ripple
                                        onClick={handleSubmit}
                                        color="primary"
                                        type="submit"
                                        className="mt-2"
                                    >
                                        {isEdit ? "Edit" : "Add"}
                                    </Button.Ripple> */}
                                </Form>
                            )}
                        </Formik>
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
                        {isEdit ? "Edit" : "Add"}
                    </Button.Ripple>
                </CardBody>
            </Card>
        </>
    );
};

export default MentorsForm;
