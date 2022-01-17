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
    UncontrolledCollapse,
    Input,
} from "reactstrap";
import { useParams } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import "./Career.scss";
import AWS from "aws-sdk";
import CKEditor from "ckeditor4-react";
import { ckEditorConfig } from "../../../utils/data";
import GalleryModal from "../gallery-modal/GalleryModal";
import { DeleteOutlined } from "@material-ui/icons";
import { API } from "../../../http/API";

const formSchema = Yup.object().shape({
    required: Yup.string().required("Required"),
});

const initialObj = {
    name: "career-page",
    page_id: 2,
    slug: "career-page",
    content: {
        joinTeam: {
            title: "",
            description: "",
        },
        openPosition: {
            title: "",
        },
        position1: {
            title: "",
            url: ""
        },
        position2: {
            title: "",
            url: ""
        },
        position3: {
            title: "",
            url: ""
        },
        bottomSec: {
            description: "",
        },
        meta_details: {
            title: "",
            description: "",
            schema_markup: "",
        },
        arabic: {
            joinTeam: {
                title: "",
                description: "",
            },
            openPosition: {
                title: "",
            },
            position1: {
                title: "",
            },
            position2: {
                title: "",
            },
            position3: {
                title: "",
            },
            bottomSec: {
                description: "",
            },
            meta_details: {
                title: "",
                description: "",
                schema_markup: "",
            },
        },
    },
};

const Career = () => {
    const [careerData, setCareerData] = useState({ ...initialObj });
    const [pageData, setPageData] = useState();

    //!------------Pages Api Call------------
    useEffect(() => {
        API.get(`/pages`)
            .then((response) => {
                // debugger;
                if (response.status === 200 || response.status === 201) {
                    let currentPage = response.data.data.find((x) => x.slug === "career-page");
                    setPageData(currentPage);
                    API.get(`/all_sections/${currentPage._id}`)
                        .then((res) => {
                            //   debugger;
                            if (
                                !res.data.data[res.data.data.length - 1].content &&
                                !res.data.data.content
                            ) {
                                res.data.data.content = initialObj.content;
                            }

                            if (
                                !res.data.data[res.data.data.length - 1].content.meta_details
                                    .schema_markup
                            ) {
                                res.data.data[
                                    res.data.data.length - 1
                                ].content.meta_details.schema_markup =
                                    initialObj.content.meta_details.schema_markup;
                            }

                            if (
                                !res.data.data[res.data.data.length - 1].content.arabic
                                    .meta_details.schema_markup
                            ) {
                                res.data.data[
                                    res.data.data.length - 1
                                ].content.arabic.meta_details.schema_markup =
                                    initialObj.content.arabic.meta_details.schema_markup;
                            }

                            let content = res.data.data[res.data.data.length - 1].content;

                            //   console.log("All widgets response", widget_content);
                            setCareerData({ ...initialObj, content });
                        })
                        .catch((err) => console.log(err));
                }
            })
            .catch((err) => console.log(err));
    }, []);

    //!*********** Handle joinTeam************
    //! __________Handle OnChange__________
    const handleJoinTeamOnChange = (e) => {
        let updatedValue = { ...careerData };
        updatedValue.content.joinTeam[e.target.name] = e.target.value;
        setCareerData(updatedValue);
    };
    //! __________Handle  Editor__________
    const handleJoinTeamEditor = (value) => {
        let updatedValue = { ...careerData };
        updatedValue.content.joinTeam.description = value;
        setCareerData(updatedValue);
    };

    //!*********** Open Position Section************
    //! __________Handle OnChange__________

    const handleOpenPositionOnChange = (e) => {
        let updatedValue = { ...careerData };
        updatedValue.content.openPosition[e.target.name] = e.target.value;
        setCareerData(updatedValue);
    };
    //!*********** Handle position1 Section************
    //! __________Handle OnChange__________

    const handlePosition1OnChange = (e) => {
        let updatedValue = { ...careerData };
        updatedValue.content.position1[e.target.name] = e.target.value;
        setCareerData(updatedValue);
    };
    //!*********** Handle position2 Section************
    //! __________Handle OnChange__________

    const handlePosition2OnChange = (e) => {
        let updatedValue = { ...careerData };
        updatedValue.content.position2[e.target.name] = e.target.value;
        setCareerData(updatedValue);
    };
    //!*********** Handle position3 Section************
    //! __________Handle OnChange__________

    const handlePosition3OnChange = (e) => {
        let updatedValue = { ...careerData };
        updatedValue.content.position3[e.target.name] = e.target.value;
        setCareerData(updatedValue);
    };

    //!*********** Handle bottom Section************
    //! __________Handle Editor__________
    const handleBottomEditor = (value) => {
        let updatedValue = { ...careerData };
        updatedValue.content.bottomSec.description = value;
        setCareerData(updatedValue);
    };

    // //!----------ADD New Section------
    // const addNewSection = () => {
    //     let updatedValue = { ...homeData };
    //     updatedValue.widget_content.promoSection.push({
    //         video_link: "",
    //         images_detail: {
    //             title: "",
    //             content: "",
    //             background_image: "",
    //         },
    //     });
    //     setHomeData(updatedValue);
    // };
    // //!--------Remove section------
    // const removeSection = (index) => {
    //     let updatedValue = { ...homeData };
    //     let updatedSection = updatedValue.widget_content.promoSection.filter(
    //         (x, i) => i !== index
    //     );
    //     updatedValue.widget_content.promoSection = updatedSection;
    //     setHomeData(updatedValue);
    // };
    //!--------Hanlde Meta Details OnChange---------
    const handleMetaOnChange = (e) => {
        let updatedValue = { ...careerData };
        updatedValue.content.meta_details[e.target.name] = e.target.value;
        setCareerData(updatedValue);
    };

    //! *************************************************************
    //? *******************Arabic Section Function*******************
    //! *************************************************************

    //!*********** Handle jointeam************
    //! __________Handle OnChange__________
    const handleArabicJoinTeamOnChange = (e) => {
        let updatedValue = { ...careerData };
        updatedValue.content.arabic.joinTeam[e.target.name] =
            e.target.value;
        setCareerData(updatedValue);
    };
    //! __________Handle  Editor__________
    const handleArabicJoinTeamEditor = (value) => {
        let updatedValue = { ...careerData };
        updatedValue.content.arabic.joinTeam.description = value;
        setCareerData(updatedValue);
    };
    //!*********** Open Position Section************
    //! __________Handle OnChange__________

    const handleArabicOpenPositionOnChange = (e) => {
        let updatedValue = { ...careerData };
        updatedValue.content.arabic.openPosition[e.target.name] =
            e.target.value;
        setCareerData(updatedValue);
    };
    //!*********** Handle Position1 Section************
    //! __________Handle OnChange__________

    const handleArabicPosition1OnChange = (e) => {
        let updatedValue = { ...careerData };
        updatedValue.content.arabic.position1[e.target.name] =
            e.target.value;
        setCareerData(updatedValue);
    };
    //!*********** Handle Position2 Section************
    //! __________Handle OnChange__________

    const handleArabicPosition2OnChange = (e) => {
        let updatedValue = { ...careerData };
        updatedValue.content.arabic.position2[e.target.name] =
            e.target.value;
        setCareerData(updatedValue);
    };
    //!*********** Handle Position1 Section************
    //! __________Handle OnChange__________

    const handleArabicPosition3OnChange = (e) => {
        let updatedValue = { ...careerData };
        updatedValue.content.arabic.position3[e.target.name] =
            e.target.value;
        setCareerData(updatedValue);
    };
    //!*********** Handle Bottom Section************
    //! __________Handle  Editor__________
    const handleArabicBottomSecEditor = (value) => {
        let updatedValue = { ...careerData };
        updatedValue.content.arabic.bottomSec.description = value;
        setCareerData(updatedValue);
    };
    // //!----------ADD New Section------
    // const addArabicNewSection = () => {
    //     let updatedValue = { ...homeData };
    //     updatedValue.widget_content.arabic.promoSection.push({
    //         images_detail: {
    //             title: "",
    //             content: "",
    //         },
    //     });
    //     setHomeData(updatedValue);
    // };
    // //!--------Remove section------
    // const removeArabicSection = (index) => {
    //     let updatedValue = { ...homeData };
    //     let updatedSection = updatedValue.widget_content.arabic.promoSection.filter(
    //         (x, i) => i !== index
    //     );
    //     updatedValue.widget_content.arabic.promoSection = updatedSection;
    //     setHomeData(updatedValue);
    // };
    //!--------Hanlde Meta Details OnChange---------
    const handleArabicMetaOnChange = (e) => {
        let updatedValue = { ...careerData };
        updatedValue.content.arabic.meta_details[e.target.name] =
            e.target.value;
        setCareerData(updatedValue);
    };
    //! --------------Handle Submit-------------
    const handleSubmit = () => {
        let updatedData = { ...careerData, page_id: pageData._id };
        // let updatedData = { ...careerData, page_id: 2 };
        API.post(`/sections`, updatedData)
            .then((response) => {
                alert("Data updated successfully");
                window.location.reload();
            })
            .catch((err) =>
                alert(
                    "Something went wrong, Please check your internet connect and reload page"
                )
            );
    };

    return (
        <>
            <Card className="home-form">
                <CardHeader>
                    <CardTitle>Join Team Section</CardTitle>
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
                                {/* //! **************Join Team  Section************** */}
                                <div className="variation-row-wrapper mb-2">
                                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                        <Card>
                                            <CardHeader id="item-1">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Join Team
                                                </CardTitle>
                                                {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                            </CardHeader>
                                            <UncontrolledCollapse toggler="#item-1">
                                                <CardBody>
                                                    <FormGroup className="mb-1">
                                                        <Label for="title">Title</Label>
                                                        <Field
                                                            name="title"
                                                            id="title"
                                                            onChange={handleJoinTeamOnChange}
                                                            value={careerData?.content?.joinTeam?.title}
                                                            className={`form-control`}
                                                        />
                                                    </FormGroup>
                                                    <Row>
                                                        <Col sm={12}>
                                                            <div>
                                                                <Label for="content">Content</Label>
                                                                <CKEditor
                                                                    config={ckEditorConfig}
                                                                    onBeforeLoad={(CKEDITOR) =>
                                                                        (CKEDITOR.disableAutoInline = true)
                                                                    }
                                                                    data={
                                                                        careerData?.content?.joinTeam
                                                                            ?.description
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleJoinTeamEditor(e.editor.getData())
                                                                    }
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </UncontrolledCollapse>
                                        </Card>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </CardBody>
            </Card>
            {/* //! **************open position  Section*************** */}
            <Card className="slider-bottom-section">
                <CardHeader>
                    <CardTitle>Open Position Section</CardTitle>
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
                                <div className="variation-row-wrapper mb-2">
                                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                        <Card>
                                            <CardHeader id="item-2">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Open Position
                                                </CardTitle>
                                                {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                            </CardHeader>
                                            <UncontrolledCollapse toggler="#item-2">
                                                <CardBody>
                                                    <FormGroup className="mb-1">
                                                        <Label for="title">Title</Label>
                                                        <Field
                                                            name="title"
                                                            id="title"
                                                            onChange={handleOpenPositionOnChange}
                                                            value={
                                                                careerData?.content?.openPosition?.title
                                                            }
                                                            className={`form-control`}
                                                        />
                                                    </FormGroup>
                                                </CardBody>
                                            </UncontrolledCollapse>
                                        </Card>
                                    </div>
                                </div>
                                {/* //! **************Position 1 Section*************** */}
                                <div className="variation-row-wrapper mb-2">
                                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                        <Card>
                                            <CardHeader id="item-3">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Reading Specialist
                                                </CardTitle>
                                                {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                            </CardHeader>
                                            <UncontrolledCollapse toggler="#item-3">
                                                <CardBody>
                                                    <FormGroup className="mb-1">
                                                        <Label for="title">Title</Label>
                                                        <Field
                                                            name="title"
                                                            id="title"
                                                            onChange={handlePosition1OnChange}
                                                            value={
                                                                careerData?.content?.position1?.title
                                                            }
                                                            className={`form-control`}
                                                        />
                                                    </FormGroup>
                                                    <FormGroup className="mb-1">
                                                        <Label for="url">URL</Label>
                                                        <Field
                                                            name="url"
                                                            id="url"
                                                            onChange={handlePosition1OnChange}
                                                            value={
                                                                careerData?.content?.position1?.url
                                                            }
                                                            className={`form-control`}
                                                        />
                                                    </FormGroup>
                                                </CardBody>
                                            </UncontrolledCollapse>
                                        </Card>
                                    </div>
                                </div>
                                {/* //! **************Position 2 Section*************** */}
                                <div className="variation-row-wrapper mb-2">
                                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                        <Card>
                                            <CardHeader id="item-4">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Academic Counselor
                                                </CardTitle>
                                                {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                            </CardHeader>
                                            <UncontrolledCollapse toggler="#item-4">
                                                <CardBody>
                                                    <FormGroup className="mb-1">
                                                        <Label for="title">Title</Label>
                                                        <Field
                                                            name="title"
                                                            id="title"
                                                            onChange={handlePosition2OnChange}
                                                            value={
                                                                careerData?.content?.position2?.title
                                                            }
                                                            className={`form-control`}
                                                        />
                                                    </FormGroup>
                                                    <FormGroup className="mb-1">
                                                        <Label for="url">URL</Label>
                                                        <Field
                                                            name="url"
                                                            id="url"
                                                            onChange={handlePosition2OnChange}
                                                            value={
                                                                careerData?.content?.position2?.url
                                                            }
                                                            className={`form-control`}
                                                        />
                                                    </FormGroup>
                                                </CardBody>
                                            </UncontrolledCollapse>
                                        </Card>
                                    </div>
                                </div>
                                {/* //! **************Position 3 Section*************** */}
                                <div className="variation-row-wrapper mb-2">
                                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                        <Card>
                                            <CardHeader id="item-5">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Social Worker
                                                </CardTitle>
                                                {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                            </CardHeader>
                                            <UncontrolledCollapse toggler="#item-5">
                                                <CardBody>
                                                    <FormGroup className="mb-1">
                                                        <Label for="title">Title</Label>
                                                        <Field
                                                            name="title"
                                                            id="title"
                                                            onChange={handlePosition3OnChange}
                                                            value={
                                                                careerData?.content?.position3?.title
                                                            }
                                                            className={`form-control`}
                                                        />
                                                    </FormGroup>
                                                    <FormGroup className="mb-1">
                                                        <Label for="url">URL</Label>
                                                        <Field
                                                            name="url"
                                                            id="url"
                                                            onChange={handlePosition3OnChange}
                                                            value={
                                                                careerData?.content?.position3?.url
                                                            }
                                                            className={`form-control`}
                                                        />
                                                    </FormGroup>
                                                </CardBody>
                                            </UncontrolledCollapse>
                                        </Card>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </CardBody>
            </Card>
            {/* //! **************Bottom  Section*************** */}
            <Card className="slider-bottom-section">
                <CardHeader>
                    <CardTitle>Bottom Section</CardTitle>
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
                                <div className="variation-row-wrapper mb-2">
                                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                        <Card>
                                            <CardHeader id="item-6">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Bottom
                                                </CardTitle>
                                                {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                            </CardHeader>
                                            <UncontrolledCollapse toggler="#item-6">
                                                <CardBody>
                                                    <Row>
                                                        <Col sm={12}>
                                                            <div>
                                                                <Label for="content">Content</Label>
                                                                <CKEditor
                                                                    config={ckEditorConfig}
                                                                    onBeforeLoad={(CKEDITOR) =>
                                                                        (CKEDITOR.disableAutoInline = true)
                                                                    }
                                                                    data={
                                                                        careerData?.content?.bottomSec
                                                                            ?.description
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleBottomEditor(e.editor.getData())
                                                                    }
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </UncontrolledCollapse>
                                        </Card>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </CardBody>
            </Card>
            {/* //! **************SEO Section*************** */}
            <Card className="welcome-section">
                <CardHeader>
                    <CardTitle>SEO Section</CardTitle>
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
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Meta Tag Details</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <FormGroup className="">
                                            <Label for="title">Meta Title</Label>
                                            <Field
                                                name="title"
                                                id="title"
                                                onChange={handleMetaOnChange}
                                                value={careerData?.content?.meta_details?.title}
                                                className={`form-control`}
                                            />
                                        </FormGroup>
                                        <div>
                                            <Label for="description" className="mb-1">
                                                Description
                                            </Label>
                                            <Input
                                                type="textarea"
                                                name="description"
                                                id="description"
                                                rows="3"
                                                onChange={handleMetaOnChange}
                                                value={
                                                    careerData?.content?.meta_details?.description
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label for="schema_markup" className="mb-1">
                                                Schema Markup
                                            </Label>
                                            <Input
                                                type="textarea"
                                                name="schema_markup"
                                                id="schema_markup"
                                                rows="3"
                                                onChange={handleMetaOnChange}
                                                value={
                                                    careerData?.content?.meta_details?.schema_markup
                                                }
                                            />
                                        </div>
                                    </CardBody>
                                </Card>
                            </Form>
                        )}
                    </Formik>
                </CardBody>
            </Card>
            {/* //! ***************************************
      //? ****************Arabic Version*************
      //! ***************************************** */}
            <div className="">
                <Card className="arabic-home-form">
                    <CardHeader>
                        <CardTitle>Arabic Join Team Section</CardTitle>
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
                                    {/* //! **************join team Section************** */}
                                    <div className="variation-row-wrapper mb-2">
                                        <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                            <Card>
                                                <CardHeader id="item-1">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        Join Team
                                                    </CardTitle>
                                                    {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                                </CardHeader>
                                                <UncontrolledCollapse toggler="#item-1">
                                                    <CardBody>
                                                        <FormGroup className="mb-1">
                                                            <Label for="title">Title</Label>
                                                            <Field
                                                                name="title"
                                                                id="title"
                                                                onChange={handleArabicJoinTeamOnChange}
                                                                value={
                                                                    careerData?.content?.arabic?.joinTeam
                                                                        ?.title
                                                                }
                                                                className={`form-control`}
                                                            />
                                                        </FormGroup>
                                                        <Row>
                                                            <Col sm={12}>
                                                                <div>
                                                                    <Label for="content">Content</Label>
                                                                    <CKEditor
                                                                        config={ckEditorConfig}
                                                                        onBeforeLoad={(CKEDITOR) =>
                                                                            (CKEDITOR.disableAutoInline = true)
                                                                        }
                                                                        data={
                                                                            careerData?.content?.arabic
                                                                                ?.joinTeam?.description
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleArabicJoinTeamEditor(
                                                                                e.editor.getData()
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </UncontrolledCollapse>
                                            </Card>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </CardBody>
                </Card>
                {/* //! **************Open Position Section*************** */}
                <Card className="arabic-slider-bottom-section">
                    <CardHeader>
                        <CardTitle>Open Position Section</CardTitle>
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
                                    <div className="variation-row-wrapper mb-2">
                                        <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                            <Card>
                                                <CardHeader id="item-2">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        Open Position
                                                    </CardTitle>
                                                    {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                                </CardHeader>
                                                <UncontrolledCollapse toggler="#item-2">
                                                    <CardBody>
                                                        <FormGroup className="mb-1">
                                                            <Label for="title">Title</Label>
                                                            <Field
                                                                name="title"
                                                                id="title"
                                                                value={
                                                                    careerData?.content?.arabic?.openPosition
                                                                        ?.title
                                                                }
                                                                onChange={handleArabicOpenPositionOnChange}
                                                                className={`form-control`}
                                                            />
                                                        </FormGroup>
                                                    </CardBody>
                                                </UncontrolledCollapse>
                                            </Card>
                                        </div>
                                    </div>
                                    {/* //! **************position1 Section*************** */}
                                    <div className="variation-row-wrapper mb-2">
                                        <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                            <Card>
                                                <CardHeader id="item-3">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        Reading Specialist
                                                    </CardTitle>
                                                    {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                                </CardHeader>
                                                <UncontrolledCollapse toggler="#item-3">
                                                    <CardBody>
                                                        <FormGroup className="mb-1">
                                                            <Label for="title">Title</Label>
                                                            <Field
                                                                name="title"
                                                                id="title"
                                                                onChange={handleArabicPosition1OnChange}
                                                                value={
                                                                    careerData?.content?.arabic
                                                                        ?.position1?.title
                                                                }
                                                                className={`form-control`}
                                                            />
                                                        </FormGroup>
                                                    </CardBody>
                                                </UncontrolledCollapse>
                                            </Card>
                                        </div>
                                    </div>
                                    {/* //! **************position2 Section*************** */}
                                    <div className="variation-row-wrapper mb-2">
                                        <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                            <Card>
                                                <CardHeader id="item-4">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        Academic Counselor
                                                    </CardTitle>
                                                    {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                                </CardHeader>
                                                <UncontrolledCollapse toggler="#item-4">
                                                    <CardBody>
                                                        <FormGroup className="mb-1">
                                                            <Label for="title">Title</Label>
                                                            <Field
                                                                name="title"
                                                                id="title"
                                                                onChange={handleArabicPosition2OnChange}
                                                                value={
                                                                    careerData?.content?.arabic
                                                                        ?.position2?.title
                                                                }
                                                                className={`form-control`}
                                                            />
                                                        </FormGroup>
                                                    </CardBody>
                                                </UncontrolledCollapse>
                                            </Card>
                                        </div>
                                    </div>
                                    {/* //! **************position3 Section*************** */}
                                    <div className="variation-row-wrapper mb-2">
                                        <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                            <Card>
                                                <CardHeader id="item-5">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        Social Worker
                                                    </CardTitle>
                                                    {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                                </CardHeader>
                                                <UncontrolledCollapse toggler="#item-5">
                                                    <CardBody>
                                                        <FormGroup className="mb-1">
                                                            <Label for="title">Title</Label>
                                                            <Field
                                                                name="title"
                                                                id="title"
                                                                onChange={handleArabicPosition3OnChange}
                                                                value={
                                                                    careerData?.content?.arabic
                                                                        ?.position3?.title
                                                                }
                                                                className={`form-control`}
                                                            />
                                                        </FormGroup>
                                                    </CardBody>
                                                </UncontrolledCollapse>
                                            </Card>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </CardBody>
                </Card>
                {/* //! **************Bottom Section*************** */}
                <Card className="arabic-welcome-section">
                    <CardHeader>
                        <CardTitle>Bottom Section</CardTitle>
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
                                    <div className="variation-row-wrapper mb-2">
                                        <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                            <Card>
                                                <CardHeader id="item-6">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        Bottom
                                                    </CardTitle>
                                                    {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                                </CardHeader>
                                                <UncontrolledCollapse toggler="#item-6">
                                                    <CardBody>
                                                        <Row>
                                                            <Col sm={12}>
                                                                <div>
                                                                    <Label for="content">Content</Label>
                                                                    <CKEditor
                                                                        config={ckEditorConfig}
                                                                        onBeforeLoad={(CKEDITOR) =>
                                                                            (CKEDITOR.disableAutoInline = true)
                                                                        }
                                                                        data={
                                                                            careerData?.content?.arabic
                                                                                ?.bottomSec?.description
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleArabicBottomSecEditor(
                                                                                e.editor.getData()
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </UncontrolledCollapse>
                                            </Card>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </CardBody>
                </Card>
                {/* //! **************SEO Section*************** */}
                <Card className="arabic-promo-section">
                    <CardHeader>
                        <CardTitle>SEO Section</CardTitle>
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
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Meta Tag Details</CardTitle>
                                        </CardHeader>
                                        <CardBody>
                                            <FormGroup className="">
                                                <Label for="title">Meta Title</Label>
                                                <Field
                                                    name="title"
                                                    id="title"
                                                    onChange={handleArabicMetaOnChange}
                                                    value={
                                                        careerData?.content?.arabic?.meta_details
                                                            ?.title
                                                    }
                                                    className={`form-control`}
                                                />
                                            </FormGroup>
                                            <div>
                                                <Label for="description" className="mb-1">
                                                    Description
                                                </Label>
                                                <Input
                                                    type="textarea"
                                                    name="description"
                                                    id="description"
                                                    rows="3"
                                                    onChange={handleArabicMetaOnChange}
                                                    value={
                                                        careerData?.content?.arabic?.meta_details
                                                            ?.description
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <Label for="schema_markup" className="my-1">
                                                    Schema Markup
                                                </Label>
                                                <Input
                                                    type="textarea"
                                                    name="schema_markup"
                                                    id="schema_markup"
                                                    rows="3"
                                                    onChange={handleArabicMetaOnChange}
                                                    value={
                                                        careerData?.content?.arabic?.meta_details
                                                            ?.schema_markup
                                                    }
                                                />
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Form>
                            )}
                        </Formik>
                    </CardBody>
                </Card>
                <div className="submit-btn-wrap">
                    <Button.Ripple onClick={handleSubmit} color="primary" type="submit">
                        Submit
                    </Button.Ripple>
                </div>
            </div>
        </>
    );
};

export default Career;
