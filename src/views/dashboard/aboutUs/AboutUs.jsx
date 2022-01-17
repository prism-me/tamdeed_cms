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
import "./AboutUs.scss";
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
    name: "about-page",
    page_id: 1,
    slug: "about-page",
    content: {
        banner: {
            title: "",
            subtitle: "",
            description: "",
            image: "",
        },
        aboutSection: {
            title: "",
            description: "",
            image: "",
        },
        principalSection: {
            title: "",
            description: "",
            video_link: "",
            image: "",
        },
        ethosSection: {
            title: "",
            description: "",
        },
        healthSection: {
            title: "",
            description: "",
            image: "",
        },
        meta_details: {
            title: "",
            description: "",
            schema_markup: "",
        },
        arabic: {
            banner: {
                title: "",
                subtitle: "",
                description: "",
            },
            aboutSection: {
                title: "",
                description: "",
            },
            principalSection: {
                title: "",
                description: ""
            },
            ethosSection: {
                title: "",
                description: "",
            },
            healthSection: {
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

const AboutUs = () => {
    const [aboutData, setAboutData] = useState({ ...initialObj });
    const [pageData, setPageData] = useState();
    const [isEdit, setIsEdit] = useState(false);
    const [modalShow, setModalShow] = React.useState(false);
    const [imagesData, setImagesData] = useState([]);
    const [isSingle, setIsSingle] = useState(false);
    const [isPrincipal, setIsPrincipal] = useState(false);
    const [isAbout, setIsAbout] = useState(false);
    const [isHealth, setIsHealth] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isPromoImage, setIsPromoImage] = useState(false);

    //******************Gallery

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
            if (isSingle && !isAbout) {
                let updatedImage = { ...aboutData };
                updatedImage.content.banner.image = imagesData[index].url;
                setAboutData(updatedImage);

                // setThumbnailPreview(imagesData.avatar);
                setTimeout(() => {
                    setModalShow(false);
                }, 500);
            }
            if (isAbout && !isSingle) {
                let updatedImage = { ...aboutData };
                updatedImage.content.aboutSection.image = imagesData[index].url;
                setAboutData(updatedImage);

                // setThumbnailPreview(imagesData.avatar);
                setTimeout(() => {
                    setModalShow(false);
                }, 500);
            }

            if (isPrincipal && !isAbout && !isSingle) {
                let updatedImage = { ...aboutData };
                updatedImage.content.principalSection.image =
                    imagesData[index].url;
                setAboutData(updatedImage);

                setTimeout(() => {
                    setModalShow(false);
                }, 500);
            }
            if (isHealth && !isSingle && !isAbout && !isPrincipal) {
                let updatedImage = { ...aboutData };
                updatedImage.content.healthSection.image =
                    imagesData[index].url;
                setAboutData(updatedImage);

                setTimeout(() => {
                    setModalShow(false);
                }, 500);
            }
            // if (isPromoImage && !isSingle && !isAbout && !isPrincipal) {
            //     let updatedImage = { ...aboutData };
            //     updatedImage.content.promoSection[
            //         currentIndex
            //     ].images_detail.background_image = imagesData[index].avatar;
            //     setAboutData(updatedImage);

            //     setTimeout(() => {
            //         setModalShow(false);
            //     }, 500);
            // }

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
                    let currentPage = response.data.data.find((x) => x.slug === "about-page");
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
                            setAboutData({ ...initialObj, content });
                        })
                        .catch((err) => console.log(err));
                }
            })
            .catch((err) => console.log(err));
    }, []);

    //!*********** Handle banner************
    //! __________Handle OnChange__________
    const handleBannerOnChange = (e) => {
        let updatedValue = { ...aboutData };
        updatedValue.content.banner[e.target.name] = e.target.value;
        setAboutData(updatedValue);
    };
    //! __________Handle  Editor__________
    const handleBannerEditor = (value) => {
        let updatedValue = { ...aboutData };
        updatedValue.content.banner.description = value;
        setAboutData(updatedValue);
    };
    //!*********** Handle about Section************
    //! __________Handle OnChange__________

    const handleAboutOnChange = (e) => {
        let updatedValue = { ...aboutData };
        updatedValue.content.aboutSection[e.target.name] = e.target.value;
        setAboutData(updatedValue);
    };
    //! __________Handle Editor__________
    const handleAboutEditor = (value) => {
        let updatedValue = { ...aboutData };
        updatedValue.content.aboutSection.description = value;
        setAboutData(updatedValue);
    };
    //!*********** Handle Principal Section************
    //! __________Handle OnChange__________
    const handlePrincipalOnChange = (e) => {
        let updatedValue = { ...aboutData };
        updatedValue.content.principalSection[e.target.name] = e.target.value;
        setAboutData(updatedValue);
    };
    //! __________Handle Editor__________
    const handlePrincipalEditor = (value) => {
        let updatedValue = { ...aboutData };
        updatedValue.content.principalSection.description = value;
        setAboutData(updatedValue);
    };
    //!*********** Handle ethosSection Section************
    //! __________Handle OnChange__________

    const handleEthosOnChange = (e) => {
        let updatedValue = { ...aboutData };
        updatedValue.content.ethosSection[e.target.name] = e.target.value;
        setAboutData(updatedValue);
    };
    //! __________Handle Editor__________
    const handleEthosEditor = (value) => {
        let updatedValue = { ...aboutData };
        updatedValue.content.ethosSection.description = value;
        setAboutData(updatedValue);
    };
    //!*********** Handle health Section************
    //! __________Handle OnChange__________

    const handleHealthOnChange = (e) => {
        let updatedValue = { ...aboutData };
        updatedValue.content.healthSection[e.target.name] = e.target.value;
        setAboutData(updatedValue);
    };
    //! __________Handle Editor__________
    const handleHealthEditor = (value) => {
        let updatedValue = { ...aboutData };
        updatedValue.content.healthSection.description = value;
        setAboutData(updatedValue);
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
        let updatedValue = { ...aboutData };
        updatedValue.content.meta_details[e.target.name] = e.target.value;
        setAboutData(updatedValue);
    };

    //! *************************************************************
    //? *******************Arabic Section Function*******************
    //! *************************************************************

    //!*********** Handle Banner************
    //! __________Handle OnChange__________
    const handleArabicBannerOnChange = (e) => {
        let updatedValue = { ...aboutData };
        updatedValue.content.arabic.banner[e.target.name] =
            e.target.value;
        setAboutData(updatedValue);
    };
    //! __________Handle  Editor__________
    const handleArabicBannerEditor = (value) => {
        let updatedValue = { ...aboutData };
        updatedValue.content.arabic.banner.description = value;
        setAboutData(updatedValue);
    };
    //!*********** Handle about Section************
    //! __________Handle OnChange__________

    const handleArabicAboutOnChange = (e) => {
        let updatedValue = { ...aboutData };
        updatedValue.content.arabic.aboutSection[e.target.name] =
            e.target.value;
        setAboutData(updatedValue);
    };
    //!*********** Handle Principal Section************
    //! __________Handle OnChange__________

    const handleArabicPrincipalOnChange = (e) => {
        let updatedValue = { ...aboutData };
        updatedValue.content.arabic.principalSection[e.target.name] =
            e.target.value;
        setAboutData(updatedValue);
    };
    //! __________Handle Editor__________
    const handleArabicPrincipalEditor = (value) => {
        let updatedValue = { ...aboutData };
        updatedValue.content.arabic.principalSection.description = value;
        setAboutData(updatedValue);
    };
    //! __________Handle Editor__________
    const handleArabicAboutEditor = (value) => {
        let updatedValue = { ...aboutData };
        updatedValue.content.arabic.aboutSection.description = value;
        setAboutData(updatedValue);
    };
    //!*********** Handle Ethos Section************
    //! __________Handle OnChange__________

    const handleArabicEthosOnChange = (e) => {
        let updatedValue = { ...aboutData };
        updatedValue.content.arabic.ethosSection[e.target.name] =
            e.target.value;
        setAboutData(updatedValue);
    };
    //! __________Handle Editor__________
    const handleArabicEthosEditor = (value) => {
        let updatedValue = { ...aboutData };
        updatedValue.content.arabic.ethosSection.description = value;
        setAboutData(updatedValue);
    };
    //!*********** Handle Health Section************
    //! __________Handle OnChange__________

    const handleArabicHealthOnChange = (e) => {
        let updatedValue = { ...aboutData };
        updatedValue.content.arabic.healthSection[e.target.name] =
            e.target.value;
        setAboutData(updatedValue);
    };
    //! __________Handle Editor__________
    const handleArabicHealthEditor = (value) => {
        let updatedValue = { ...aboutData };
        updatedValue.content.arabic.healthSection.description = value;
        setAboutData(updatedValue);
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
        let updatedValue = { ...aboutData };
        updatedValue.content.arabic.meta_details[e.target.name] =
            e.target.value;
        setAboutData(updatedValue);
    };
    //! --------------Handle Submit-------------
    const handleSubmit = () => {
        let updatedData = { ...aboutData, page_id: pageData._id };
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
                    <CardTitle>Overview Section</CardTitle>
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
                                                    Overview
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
                                                            onChange={handleBannerOnChange}
                                                            value={aboutData?.content?.banner?.title}
                                                            className={`form-control`}
                                                        />
                                                    </FormGroup>
                                                    <FormGroup className="mb-1">
                                                        <Label for="title">SubTitle</Label>
                                                        <Field
                                                            name="subtitle"
                                                            id="subtitle"
                                                            onChange={handleBannerOnChange}
                                                            value={aboutData?.content?.banner?.subtitle}
                                                            className={`form-control`}
                                                        />
                                                    </FormGroup>
                                                    <Row>
                                                        <Col sm={9}>
                                                            <div>
                                                                <Label for="content">Description</Label>
                                                                <CKEditor
                                                                    config={ckEditorConfig}
                                                                    onBeforeLoad={(CKEDITOR) =>
                                                                        (CKEDITOR.disableAutoInline = true)
                                                                    }
                                                                    data={
                                                                        aboutData?.content?.banner
                                                                            ?.description
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleBannerEditor(e.editor.getData())
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
                                                                    {aboutData?.content?.banner
                                                                        ?.image !== "" && (
                                                                            <img
                                                                                src={
                                                                                    aboutData?.content?.banner
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
                                                                        setIsSingle(true);
                                                                        setIsAbout(false);
                                                                        setIsPrincipal(false);
                                                                        setIsHealth(false);
                                                                        setModalShow(true);
                                                                    }}
                                                                >
                                                                    Banner Image
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
                        {/* //! **************Core Values Section*************** */}
                        <Card className="slider-bottom-section">
                <CardHeader>
                    <CardTitle>Core Values Section</CardTitle>
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
                                                    Core Values
                                                </CardTitle>
                                                {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                            </CardHeader>
                                            <UncontrolledCollapse toggler="#item-4">
                                                <CardBody>
                                                    <FormGroup className="mb-1">
                                                        <Label for="title">Our Vision Title</Label>
                                                        <Field
                                                            name="title"
                                                            id="title"
                                                            onChange={handleEthosOnChange}
                                                            value={
                                                                aboutData?.content?.ethosSection?.title
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
                                                                        aboutData?.content?.ethosSection
                                                                            ?.description
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleEthosEditor(e.editor.getData())
                                                                    }
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <FormGroup className="mb-1 mt-2">
                                                        <Label for="title">Our Mission Title</Label>
                                                        <Field
                                                            name="title"
                                                            id="title"
                                                            onChange={handleEthosOnChange}
                                                            value={
                                                                aboutData?.content?.ethosSection?.title
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
                                                                        aboutData?.content?.ethosSection
                                                                            ?.description
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleEthosEditor(e.editor.getData())
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
            {/* //! **************About  Section*************** */}
            <Card className="slider-bottom-section">
                <CardHeader>
                    <CardTitle>Executive Management Title</CardTitle>
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
                                                Executive Management
                                                </CardTitle>
                                            </CardHeader>
                                            <UncontrolledCollapse toggler="#item-2">
                                                <CardBody>
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
                                                                        aboutData?.content?.aboutSection
                                                                            ?.description
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleAboutEditor(e.editor.getData())
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
                                                                    {aboutData?.content?.aboutSection
                                                                        ?.image !== "" && (
                                                                            <img
                                                                                src={
                                                                                    aboutData?.content?.aboutSection
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
                                                                        setIsSingle(false);
                                                                        setIsAbout(true);
                                                                        setIsPrincipal(false);
                                                                        setIsHealth(false);
                                                                        setModalShow(true);
                                                                    }}
                                                                >
                                                                    Featured Image
                                                                </Button.Ripple>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                                <CardBody>
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
                                                                        aboutData?.content?.aboutSection
                                                                            ?.description
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleAboutEditor(e.editor.getData())
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
                                                                    {aboutData?.content?.aboutSection
                                                                        ?.image !== "" && (
                                                                            <img
                                                                                src={
                                                                                    aboutData?.content?.aboutSection
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
                                                                        setIsSingle(false);
                                                                        setIsAbout(true);
                                                                        setIsPrincipal(false);
                                                                        setIsHealth(false);
                                                                        setModalShow(true);
                                                                    }}
                                                                >
                                                                    Featured Image
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


        </>
    );
};

export default AboutUs;
