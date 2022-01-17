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
import "./MiddleSchool.scss";
import CKEditor from "ckeditor4-react";
import { ckEditorConfig } from "../../../../utils/data";

import GalleryModal from "../../gallery-modal/GalleryModal";
import { DeleteOutlined } from "@material-ui/icons";
import { API } from "../../../../http/API";

const formSchema = Yup.object().shape({
    required: Yup.string().required("Required"),
});

const initialObj = {
    name: "middle-page",
    page_id: 8,
    slug: "middle-page",
    content: {
        section1: {
            title: "",
            video_link: "",
            description: "",
            image: "",
        },
        section2: {
            title: "",
            video_link: "",
            description: "",
            image: "",
        },
        section3: {
            description: "",
        },
        section4: {
            description: "",
        },
        section5: {
            title: "",
            video_link: "",
            description: "",
            image: "",
        },
        section6: {
            title: "",
            video_link: "",
            description: "",
            image: "",
        },
        meta_details: {
            title: "",
            description: "",
            schema_markup: "",
        },
        arabic: {
            section1: {
                title: "",
                description: "",
            },
            section2: {
                title: "",
                description: "",
            },
            section3: {
                description: "",
            },
            section4: {
                description: "",
            },
            section5: {
                title: "",
                description: "",
            },
            section6: {
                title: "",
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

const MiddleSchool = () => {
    const [middleData, setMiddleData] = useState({ ...initialObj });
    const [pageData, setPageData] = useState();
    const [isEdit, setIsEdit] = useState(false);
    const [modalShow, setModalShow] = React.useState(false);
    const [imagesData, setImagesData] = useState([]);
    const [isSection1, setIsSection1] = useState(false);
    const [isSection2, setIsSection2] = useState(false);
    const [isSection5, setIsSection5] = useState(false);
    const [isSection6, setIsSection6] = useState(false);

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

    //!-------handleSelect s3 Images-----------
    const handleImageSelect = (e, index) => {
        if (e.target.checked) {
            //   debugger;
            if (isSection1 && !isSection2) {
                let updatedImage = { ...middleData };
                updatedImage.content.section1.image = imagesData[index].url;
                setMiddleData(updatedImage);

                // setThumbnailPreview(imagesData.avatar);
                setTimeout(() => {
                    setModalShow(false);
                }, 500);
            }
            if (isSection2 && !isSection1) {
                let updatedImage = { ...middleData };
                updatedImage.content.section2.image = imagesData[index].url;
                setMiddleData(updatedImage);

                // setThumbnailPreview(imagesData.avatar);
                setTimeout(() => {
                    setModalShow(false);
                }, 500);
            }

            if (isSection5 && !isSection2 && !isSection1) {
                let updatedImage = { ...middleData };
                updatedImage.content.section5.image =
                    imagesData[index].url;
                setMiddleData(updatedImage);

                setTimeout(() => {
                    setModalShow(false);
                }, 500);
            }
            if (isSection6 && !isSection1 && !isSection2 && !isSection5) {
                let updatedImage = { ...middleData };
                updatedImage.content.section6.image =
                    imagesData[index].url;
                setMiddleData(updatedImage);

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

    //!------------Pages Api Call------------
    useEffect(() => {
        API.get(`/pages`)
            .then((response) => {
                // debugger;
                if (response.status === 200 || response.status === 201) {
                    let currentPage = response.data.data.find((x) => x.slug === "middle-page");
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

                            //   console.log("All widgets response", content);
                            setMiddleData({ ...initialObj, content });
                        })
                        .catch((err) => console.log(err));
                }
            })
            .catch((err) => console.log(err));
    }, []);

    //!*********** Handle section1************
    //! __________Handle OnChange__________
    const handlesection1OnChange = (e) => {
        let updatedValue = { ...middleData };
        updatedValue.content.section1[e.target.name] = e.target.value;
        setMiddleData(updatedValue);
    };
    //! __________Handle  Editor__________
    const handlesection1Editor = (value) => {
        let updatedValue = { ...middleData };
        updatedValue.content.section1.description = value;
        setMiddleData(updatedValue);
    };
    //!*********** Handle Section2************
    //! __________Handle OnChange__________

    const handlesection2OnChange = (e) => {
        let updatedValue = { ...middleData };
        updatedValue.content.section2[e.target.name] = e.target.value;
        setMiddleData(updatedValue);
    };
    //! __________Handle Editor__________
    const handlesection2Editor = (value) => {
        let updatedValue = { ...middleData };
        updatedValue.content.section2.description = value;
        setMiddleData(updatedValue);
    };
    //!*********** Handle Section3************
    //! __________Handle Editor__________
    const handlesection3Editor = (value) => {
        let updatedValue = { ...middleData };
        updatedValue.content.section3.description = value;
        setMiddleData(updatedValue);
    };
    //!*********** Handle Section4************

    //! __________Handle Editor__________
    const handlesection4Editor = (value) => {
        let updatedValue = { ...middleData };
        updatedValue.content.section4.description = value;
        setMiddleData(updatedValue);
    };
    //!*********** Handle Section5************
    //! __________Handle OnChange__________
    const handlesection5OnChange = (e) => {
        let updatedValue = { ...middleData };
        updatedValue.content.section5[e.target.name] = e.target.value;
        setMiddleData(updatedValue);
    };
    //! __________Handle Editor__________
    const handlesection5Editor = (value) => {
        let updatedValue = { ...middleData };
        updatedValue.content.section5.description = value;
        setMiddleData(updatedValue);
    };
    //!*********** Handle Section6************
    //! __________Handle OnChange__________
    const handlesection6OnChange = (e) => {
        let updatedValue = { ...middleData };
        updatedValue.content.section6[e.target.name] = e.target.value;
        setMiddleData(updatedValue);
    };
    //! __________Handle Editor__________
    const handlesection6Editor = (value) => {
        let updatedValue = { ...middleData };
        updatedValue.content.section6.description = value;
        setMiddleData(updatedValue);
    };

    // //!----------ADD New Section------
    // const addNewSection = () => {
    //     let updatedValue = { ...middleData };
    //     updatedValue.content.promoSection.push({
    //         video_link: "",
    //         images_detail: {
    //             title: "",
    //             content: "",
    //             background_image: "",
    //         },
    //     });
    //     setMiddleData(updatedValue);
    // };
    // //!--------Remove section------
    // const removeSection = (index) => {
    //     let updatedValue = { ...middleData };
    //     let updatedSection = updatedValue.content.promoSection.filter(
    //         (x, i) => i !== index
    //     );
    //     updatedValue.content.promoSection = updatedSection;
    //     setMiddleData(updatedValue);
    // };
    //!--------Hanlde Meta Details OnChange---------
    const handleMetaOnChange = (e) => {
        let updatedValue = { ...middleData };
        updatedValue.content.meta_details[e.target.name] = e.target.value;
        setMiddleData(updatedValue);
    };

    //! *************************************************************
    //? *******************Arabic Section Function*******************
    //! *************************************************************

    //!*********** Handle Section1************
    //! __________Handle OnChange__________
    const handleArabicsection1OnChange = (e) => {
        let updatedValue = { ...middleData };
        updatedValue.content.arabic.section1[e.target.name] =
            e.target.value;
        setMiddleData(updatedValue);
    };
    //! __________Handle  Editor__________
    const handleArabicsection1Editor = (value) => {
        let updatedValue = { ...middleData };
        updatedValue.content.arabic.section1.description = value;
        setMiddleData(updatedValue);
    };
    //!*********** Handle Section2************
    //! __________Handle OnChange__________
    const handleArabicsection2OnChange = (e) => {
        let updatedValue = { ...middleData };
        updatedValue.content.arabic.section2[e.target.name] =
            e.target.value;
        setMiddleData(updatedValue);
    };
    //! __________Handle Editor__________
    const handleArabicsection2Editor = (value) => {
        let updatedValue = { ...middleData };
        updatedValue.content.arabic.section2.description = value;
        setMiddleData(updatedValue);
    };

    //!*********** Handle Section3************
    //! __________Handle Editor__________
    const handleArabicsection3Editor = (value) => {
        let updatedValue = { ...middleData };
        updatedValue.content.arabic.section3.description = value;
        setMiddleData(updatedValue);
    };

    //!*********** Handle Section4************
    //! __________Handle Editor__________
    const handleArabicsection4Editor = (value) => {
        let updatedValue = { ...middleData };
        updatedValue.content.arabic.section4.description = value;
        setMiddleData(updatedValue);
    };
    //!*********** Handle Section5************
    //! __________Handle OnChange__________
    const handleArabicsection5OnChange = (e) => {
        let updatedValue = { ...middleData };
        updatedValue.content.arabic.section5[e.target.name] =
            e.target.value;
        setMiddleData(updatedValue);
    };
    //! __________Handle Editor__________
    const handleArabicsection5Editor = (value) => {
        let updatedValue = { ...middleData };
        updatedValue.content.arabic.section5.description = value;
        setMiddleData(updatedValue);
    };
    //!*********** Handle Section6************
    //! __________Handle OnChange__________
    const handleArabicsection6OnChange = (e) => {
        let updatedValue = { ...middleData };
        updatedValue.content.arabic.section6[e.target.name] =
            e.target.value;
        setMiddleData(updatedValue);
    };
    //! __________Handle Editor__________
    const handleArabicsection6Editor = (value) => {
        let updatedValue = { ...middleData };
        updatedValue.content.arabic.section6.description = value;
        setMiddleData(updatedValue);
    };

    // //!----------ADD New Section------
    // const addArabicNewSection = () => {
    //     let updatedValue = { ...middleData };
    //     updatedValue.content.arabic.promoSection.push({
    //         images_detail: {
    //             title: "",
    //             content: "",
    //         },
    //     });
    //     setMiddleData(updatedValue);
    // };
    // //!--------Remove section------
    // const removeArabicSection = (index) => {
    //     let updatedValue = { ...middleData };
    //     let updatedSection = updatedValue.content.arabic.promoSection.filter(
    //         (x, i) => i !== index
    //     );
    //     updatedValue.content.arabic.promoSection = updatedSection;
    //     setMiddleData(updatedValue);
    // };
    //!--------Hanlde Meta Details OnChange---------
    const handleArabicMetaOnChange = (e) => {
        let updatedValue = { ...middleData };
        updatedValue.content.arabic.meta_details[e.target.name] =
            e.target.value;
        setMiddleData(updatedValue);
    };
    //! --------------Handle Submit-------------
    const handleSubmit = () => {
        let updatedData = { ...middleData, page_id: pageData._id };
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
                    <CardTitle>Section 1</CardTitle>
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
                                {/* //! **************Banner Section************** */}
                                <div className="variation-row-wrapper mb-2">
                                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                        <Card>
                                            <CardHeader id="item-1">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Section 1
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
                                                            onChange={handlesection1OnChange}
                                                            value={middleData?.content?.section1?.title}
                                                            className={`form-control`}
                                                        />
                                                    </FormGroup>
                                                    <FormGroup className="mb-1">
                                                        <Label for="video_link">Url</Label>
                                                        <Field
                                                            name="video_link"
                                                            id="video_link"
                                                            onChange={handlesection1OnChange}
                                                            value={middleData?.content?.section1?.video_link}
                                                            className={`form-control`}
                                                        />
                                                    </FormGroup>
                                                    <Row>
                                                        <Col sm={9}>
                                                            <div>
                                                                <Label for="content">Content</Label>
                                                                <CKEditor
                                                                    config={ckEditorConfig}
                                                                    onBeforeLoad={(CKEDITOR) =>
                                                                        (CKEDITOR.disableAutoInline = true)
                                                                    }
                                                                    data={
                                                                        middleData?.content?.section1
                                                                            ?.description
                                                                    }
                                                                    onChange={(e) =>
                                                                        handlesection1Editor(e.editor.getData())
                                                                    }
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col sm={3}>
                                                            <FormGroup className="">
                                                                <Label for="video_thumbnail">
                                                                    Upload Image
                                                                </Label>
                                                                <div className="clearfix" />
                                                                <div className="img-preview-wrapper">
                                                                    {middleData?.content?.section1
                                                                        ?.image !== "" && (
                                                                            <img
                                                                                src={
                                                                                    middleData?.content?.section1
                                                                                        ?.image
                                                                                }
                                                                                alt=""
                                                                            />
                                                                        )}
                                                                </div>
                                                                <Button.Ripple
                                                                    color="primary"
                                                                    className="p-1"
                                                                    onClick={() => {
                                                                        setIsSection1(true);
                                                                        setIsSection2(false);
                                                                        setIsSection5(false);
                                                                        setIsSection6(false);
                                                                        setModalShow(true);
                                                                    }}
                                                                >
                                                                    Section 1 Image
                                                                </Button.Ripple>
                                                            </FormGroup>
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
                <GalleryModal
                    open={modalShow}
                    handleClose={() => setModalShow(false)}
                    handleImageSelect={handleImageSelect}
                    data={imagesData}
                    refreshData={getGalleryImages}
                />
            </Card>
            {/* //! **************Section 2*************** */}
            <Card className="slider-bottom-section">
                <CardHeader>
                    <CardTitle>Section 2</CardTitle>
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
                                                    Section 2
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
                                                            onChange={handlesection2OnChange}
                                                            value={middleData?.content?.section2?.title}
                                                            className={`form-control`}
                                                        />
                                                    </FormGroup>
                                                    <FormGroup className="mb-1">
                                                        <Label for="video_link">Url</Label>
                                                        <Field
                                                            name="video_link"
                                                            id="video_link"
                                                            onChange={handlesection2OnChange}
                                                            value={middleData?.content?.section2?.video_link}
                                                            className={`form-control`}
                                                        />
                                                    </FormGroup>
                                                    <Row>
                                                        <Col sm={9}>
                                                            <div>
                                                                <Label for="content">Content</Label>
                                                                <CKEditor
                                                                    config={ckEditorConfig}
                                                                    onBeforeLoad={(CKEDITOR) =>
                                                                        (CKEDITOR.disableAutoInline = true)
                                                                    }
                                                                    data={
                                                                        middleData?.content?.section2
                                                                            ?.description
                                                                    }
                                                                    onChange={(e) =>
                                                                        handlesection2Editor(e.editor.getData())
                                                                    }
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col sm={3}>
                                                            <FormGroup className="">
                                                                <Label for="video_thumbnail">
                                                                    Upload Image
                                                                </Label>
                                                                <div className="clearfix" />
                                                                <div className="img-preview-wrapper">
                                                                    {middleData?.content?.section2
                                                                        ?.image !== "" && (
                                                                            <img
                                                                                src={
                                                                                    middleData?.content?.section2
                                                                                        ?.image
                                                                                }
                                                                                alt=""
                                                                            />
                                                                        )}
                                                                </div>
                                                                <Button.Ripple
                                                                    color="primary"
                                                                    className="p-1"
                                                                    onClick={() => {
                                                                        setIsSection1(false);
                                                                        setIsSection2(true);
                                                                        setIsSection5(false);
                                                                        setIsSection6(false);
                                                                        setModalShow(true);
                                                                    }}
                                                                >
                                                                    Section 2 Image
                                                                </Button.Ripple>
                                                            </FormGroup>
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
                <GalleryModal
                    open={modalShow}
                    handleClose={() => setModalShow(false)}
                    handleImageSelect={handleImageSelect}
                    data={imagesData}
                    refreshData={getGalleryImages}
                />
            </Card>
            {/* //! **************Section 3*************** */}
            <Card className="welcome-section">
                <CardHeader>
                    <CardTitle>Section 3</CardTitle>
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
                                            <CardHeader id="item-3">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Section 3
                                                </CardTitle>
                                                {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                            </CardHeader>
                                            <UncontrolledCollapse toggler="#item-3">
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
                                                                        middleData?.content?.section3
                                                                            ?.description
                                                                    }
                                                                    onChange={(e) =>
                                                                        handlesection3Editor(e.editor.getData())
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
            {/* //! **************Section 4*************** */}
            <Card className="slider-bottom-section">
                <CardHeader>
                    <CardTitle>Section 4</CardTitle>
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
                                            <CardHeader id="item-4">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Section 4
                                                </CardTitle>
                                                {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                            </CardHeader>
                                            <UncontrolledCollapse toggler="#item-4">
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
                                                                        middleData?.content?.section4
                                                                            ?.description
                                                                    }
                                                                    onChange={(e) =>
                                                                        handlesection4Editor(e.editor.getData())
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
            {/* //! **************Section 5*************** */}
            <Card className="slider-bottom-section">
                <CardHeader>
                    <CardTitle>Section 5</CardTitle>
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
                                            <CardHeader id="item-5">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Section 5
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
                                                            onChange={handlesection5OnChange}
                                                            value={middleData?.content?.section5?.title}
                                                            className={`form-control`}
                                                        />
                                                    </FormGroup>
                                                    <FormGroup className="mb-1">
                                                        <Label for="video_link">Url</Label>
                                                        <Field
                                                            name="video_link"
                                                            id="video_link"
                                                            onChange={handlesection5OnChange}
                                                            value={middleData?.content?.section5?.video_link}
                                                            className={`form-control`}
                                                        />
                                                    </FormGroup>
                                                    <Row>
                                                        <Col sm={9}>
                                                            <div>
                                                                <Label for="content">Content</Label>
                                                                <CKEditor
                                                                    config={ckEditorConfig}
                                                                    onBeforeLoad={(CKEDITOR) =>
                                                                        (CKEDITOR.disableAutoInline = true)
                                                                    }
                                                                    data={
                                                                        middleData?.content?.section5?.description
                                                                    }
                                                                    onChange={(e) =>
                                                                        handlesection5Editor(
                                                                            e.editor.getData()
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col sm={3}>
                                                            <FormGroup className="">
                                                                <Label for="video_thumbnail">
                                                                    Upload Image
                                                                </Label>
                                                                <div className="clearfix" />
                                                                <div className="img-preview-wrapper">
                                                                    {middleData?.content?.section5
                                                                        ?.image !== "" && (
                                                                            <img
                                                                                src={
                                                                                    middleData?.content?.section5
                                                                                        ?.image
                                                                                }
                                                                                alt=""
                                                                            />
                                                                        )}
                                                                </div>
                                                                <Button.Ripple
                                                                    color="primary"
                                                                    className="p-1"
                                                                    onClick={() => {
                                                                        setIsSection1(false);
                                                                        setIsSection2(false);
                                                                        setIsSection5(true);
                                                                        setIsSection6(false);
                                                                        setModalShow(true);
                                                                    }}
                                                                >
                                                                    Section 5 Image
                                                                </Button.Ripple>
                                                            </FormGroup>
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
                <GalleryModal
                    open={modalShow}
                    handleClose={() => setModalShow(false)}
                    handleImageSelect={handleImageSelect}
                    data={imagesData}
                    refreshData={getGalleryImages}
                />
            </Card>
            {/* //! **************Section 6*************** */}
            <Card className="slider-bottom-section">
                <CardHeader>
                    <CardTitle>Section 6</CardTitle>
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
                                                    Section 6
                                                </CardTitle>
                                                {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                            </CardHeader>
                                            <UncontrolledCollapse toggler="#item-6">
                                                <CardBody>
                                                    <FormGroup className="mb-1">
                                                        <Label for="title">Title</Label>
                                                        <Field
                                                            name="title"
                                                            id="title"
                                                            onChange={handlesection6OnChange}
                                                            value={middleData?.content?.section6?.title}
                                                            className={`form-control`}
                                                        />
                                                    </FormGroup>
                                                    <FormGroup className="mb-1">
                                                        <Label for="video_link">Url</Label>
                                                        <Field
                                                            name="video_link"
                                                            id="video_link"
                                                            onChange={handlesection6OnChange}
                                                            value={middleData?.content?.section6?.video_link}
                                                            className={`form-control`}
                                                        />
                                                    </FormGroup>
                                                    <Row>
                                                        <Col sm={9}>
                                                            <div>
                                                                <Label for="content">Content</Label>
                                                                <CKEditor
                                                                    config={ckEditorConfig}
                                                                    onBeforeLoad={(CKEDITOR) =>
                                                                        (CKEDITOR.disableAutoInline = true)
                                                                    }
                                                                    data={
                                                                        middleData?.content?.section6?.description
                                                                    }
                                                                    onChange={(e) =>
                                                                        handlesection6Editor(
                                                                            e.editor.getData()
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col sm={3}>
                                                            <FormGroup className="">
                                                                <Label for="video_thumbnail">
                                                                    Upload Image
                                                                </Label>
                                                                <div className="clearfix" />
                                                                <div className="img-preview-wrapper">
                                                                    {middleData?.content?.section6
                                                                        ?.image !== "" && (
                                                                            <img
                                                                                src={
                                                                                    middleData?.content?.section6
                                                                                        ?.image
                                                                                }
                                                                                alt=""
                                                                            />
                                                                        )}
                                                                </div>
                                                                <Button.Ripple
                                                                    color="primary"
                                                                    className="p-1"
                                                                    onClick={() => {
                                                                        setIsSection1(false);
                                                                        setIsSection2(false);
                                                                        setIsSection5(false);
                                                                        setIsSection6(true);
                                                                        setModalShow(true);
                                                                    }}
                                                                >
                                                                    Section 6 Image
                                                                </Button.Ripple>
                                                            </FormGroup>
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
                <GalleryModal
                    open={modalShow}
                    handleClose={() => setModalShow(false)}
                    handleImageSelect={handleImageSelect}
                    data={imagesData}
                    refreshData={getGalleryImages}
                />
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
                                                value={middleData?.content?.meta_details?.title}
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
                                                    middleData?.content?.meta_details?.description
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
                                                    middleData?.content?.meta_details?.schema_markup
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
                        <CardTitle>Arabic Section 1</CardTitle>
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
                                    {/* //! **************Section 1************** */}
                                    <div className="variation-row-wrapper mb-2">
                                        <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                            <Card>
                                                <CardHeader id="item-1">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        Section 1
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
                                                                onChange={handleArabicsection1OnChange}
                                                                value={
                                                                    middleData?.content?.arabic?.section1
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
                                                                            middleData?.content?.arabic
                                                                                ?.section1?.description
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleArabicsection1Editor(
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
                {/* //! **************Section 2*************** */}
                <Card className="arabic-slider-bottom-section">
                    <CardHeader>
                        <CardTitle>Section 2</CardTitle>
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
                                                        Section 2
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
                                                                onChange={handleArabicsection2OnChange}
                                                                value={
                                                                    middleData?.content?.arabic?.section2
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
                                                                            middleData?.content?.arabic
                                                                                ?.section2?.description
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleArabicsection2Editor(
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

                {/* //! **************Section 3*************** */}
                <Card className="arabic-slider-bottom-section">
                    <CardHeader>
                        <CardTitle>Section 3</CardTitle>
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
                                                <CardHeader id="item-3">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        Section 3
                                                    </CardTitle>
                                                    {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                                </CardHeader>
                                                <UncontrolledCollapse toggler="#item-3">
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
                                                                            middleData?.content?.arabic
                                                                                ?.section3?.description
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleArabicsection3Editor(
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
                {/* //! **************Section 4*************** */}
                <Card className="arabic-slider-bottom-section">
                    <CardHeader>
                        <CardTitle>Section 4</CardTitle>
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
                                                <CardHeader id="item-4">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        Section 4
                                                    </CardTitle>
                                                    {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                                </CardHeader>
                                                <UncontrolledCollapse toggler="#item-4">
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
                                                                            middleData?.content?.arabic
                                                                                ?.section4?.description
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleArabicsection4Editor(
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
                {/* //! *************Section 5*************** */}
                <Card className="arabic-welcome-section">
                    <CardHeader>
                        <CardTitle>Section 5</CardTitle>
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
                                                <CardHeader id="item-5">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        Section 5
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
                                                                onChange={handleArabicsection5OnChange}
                                                                value={
                                                                    middleData?.content?.arabic?.section5
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
                                                                            middleData?.content?.arabic
                                                                                ?.section5?.description
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleArabicsection5Editor(
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
                {/* //! *************Section 6*************** */}
                <Card className="arabic-welcome-section">
                    <CardHeader>
                        <CardTitle>Section 6</CardTitle>
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
                                                        Section 6
                                                    </CardTitle>
                                                    {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                                </CardHeader>
                                                <UncontrolledCollapse toggler="#item-6">
                                                    <CardBody>
                                                        <FormGroup className="mb-1">
                                                            <Label for="title">Title</Label>
                                                            <Field
                                                                name="title"
                                                                id="title"
                                                                onChange={handleArabicsection6OnChange}
                                                                value={
                                                                    middleData?.content?.arabic?.section6
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
                                                                            middleData?.content?.arabic
                                                                                ?.section6?.description
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleArabicsection6Editor(
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
                                                        middleData?.content?.arabic?.meta_details
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
                                                        middleData?.content?.arabic?.meta_details
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
                                                        middleData?.content?.arabic?.meta_details
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

export default MiddleSchool;
