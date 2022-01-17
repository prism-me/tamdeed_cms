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
import "./TeamForm.scss";
import CKEditor from "ckeditor4-react";
import { ckEditorConfig } from "../../../../utils/data";
import GalleryModal from "../../gallery-modal/GalleryModal";
import { API } from "../../../../http/API";
import { UpdateTwoTone } from "@material-ui/icons";
import Select from "react-select";

const options = [
  { value: "Company Head", label: "Company Head" },
  { value: "Sales Force GTM", label: "Sales Force GTM" }
];


const formSchema = Yup.object().shape({
    required: Yup.string().required("Required"),
});

const initialObj = {
    name: "",
    description: "",
    avatar: "",
    designation: "",
    fb_link: "",
    twiter_link: "",
    insta_link: "",
    linkedin_link: "",
    route: "",
    selectedOption: null,
};

const TeamForm = (props) => {
    const history = useHistory();
    const { id } = useParams();
    const [team, setTeam] = useState({ ...initialObj });
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
            API.get(`/team/${id}`)
                .then((response) => {
                    // debugger;
                    if (!response.data.data.arabic) {
                        response.data.data.arabic = initialObj.arabic;
                    }
                    if (response.status === 200 || response.status === 201) {
                        setTeam(response.data.data);
                        // console.log(mentors);
                    }
                })
                .catch((err) => console.log(err));
        }
    }, []);

    useEffect(
        () => {
            setTeam({
                ...team,
                route: team.name.replace(/\s+/g, "-").toLocaleLowerCase(),
            });
        },
        isEdit ? [] : [team.name]
    );

    const handleImageSelect = (e, index) => {
        if (e.target.checked) {
            if (isSingle && !isBanner) {
                setTeam({
                    ...team,
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
        let updatedValues = { ...team };
        updatedValues[e.target.name] = e.target.value;
        setTeam(updatedValues);
    };

    const handleDesignationChange = selectedOption => {
      let updatedValues = { ...team };
        // console.log(updatedValues.designation.value)
        updatedValues.designation = selectedOption.value;
        updatedValues.selectedOption = selectedOption;
        setTeam(updatedValues);
    };
    //! Handle Arbic OnChnage
    const handleArabicOnChange = (e) => {
        // debugger;
        let updatedValue = { ...team };
        updatedValue.arabic[e.target.name] = e.target.value;
        setTeam(updatedValue);
    };
    //! ***Handle Arabic Editor***
    const handleArabicEditor = (value) => {
        // debugger;
        let updatedValue = { ...team };
        updatedValue.arabic.description = value;
        setTeam(updatedValue);
    };

    //!------------------Submit and Edit---------------
    const handleSubmit = () => {
        let updatedData = { ...team };
        console.log("===updatedData");
        console.log(updatedData);
        // updatedData.arabic.featured_img = updatedData.featured_img;
        if (isEdit) {
            let updateId = updatedData.route;
            delete updatedData["_id"];
            API.put(`/team/${updateId}`, updatedData)
                .then((response) => {
                    if (response.status === 200 || response.status === 201) {
                        alert("Team updated successfully");
                        history.push("/Team/list");
                    }
                })
                .catch((err) => alert("Something went wrong"));
        }
        else {
            API.post(`/team`, team)
                .then((response) => {
                    if (response.status === 200 || response.status === 201) {
                        alert("Mentors added successfully");
                        history.push("/Team/list");
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
                        Our Team {isEdit ? "Edit" : ""} Form
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
                                        value={team.name}
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
                                                data={team.description}
                                                onChange={(e) =>
                                                    setTeam({
                                                        ...team,
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
                                                {team.avatar !== "" && (
                                                    <img src={team.avatar} alt="" className="img-fluid" />
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
                                    <Label for="designation">Designation</Label>
                                    {/* <Field
                                        name="designation"
                                        id="designation"
                                        onChange={handleFieldChange}
                                        value={team.designation}
                                        className={`form-control`}
                                    /> */}
                                        <Select
                                          value={team.selectedOption}
                                          onChange={handleDesignationChange}
                                          options={options}
                                          name="designation"
                                          placeholder="Designation"
                                          isSearchable={options}
                                        />
                                </FormGroup>
                                <FormGroup className="mb-1">
                                    <Label for="fb_link">Facebook link</Label>
                                    <Field
                                        name="fb_link"
                                        id="fb_link"
                                        onChange={handleFieldChange}
                                        value={team.fb_link}
                                        className={`form-control`}
                                    />
                                </FormGroup>
                                <FormGroup className="mb-1">
                                    <Label for="twiter_link">Twiter link</Label>
                                    <Field
                                        name="twiter_link"
                                        id="twiter_link"
                                        onChange={handleFieldChange}
                                        value={team.twiter_link}
                                        className={`form-control`}
                                    />
                                </FormGroup>
                                <FormGroup className="mb-1">
                                    <Label for="linkedin_link">linkedin link</Label>
                                    <Field
                                        name="linkedin_link"
                                        id="linkedin_link"
                                        onChange={handleFieldChange}
                                        value={team.linkedin_link}
                                        className={`form-control`}
                                    />
                                </FormGroup>
                                <FormGroup className="mb-1">
                                    <Label for="insta_link">Instagram link</Label>
                                    <Field
                                        name="insta_link"
                                        id="insta_link"
                                        onChange={handleFieldChange}
                                        value={team.insta_link}
                                        className={`form-control`}
                                    />
                                </FormGroup>
                                <FormGroup className="mb-1">
                                    <Label for="route">Route</Label>
                                    <Field
                                        name="route"
                                        id="route"
                                        onChange={handleFieldChange}
                                        value={team.route}
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
                                            value={team?.arabic?.name}
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
                                                    data={team?.arabic?.description}
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

export default TeamForm;
