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
import "./Academics.scss";
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
    name: "academics-page",
    page_id: 2,
    slug: "academics-page",
    content: {
        banner: {
            title: "",
            subtitle: "",
            description: "",
            image: "",
        },
        calendarSection: {
            title: "",
        },
        accreditationsSection: {
            title: "",
            description: "",
        },
        curriculumSection: {
            title: "",
            description: "",
        },
        kindergartenSection: {
            title: "",
            image: "",
        },
        primarySection: {
            title: "",
            image: "",
        },
        middleSection: {
            title: "",
            image: "",
        },
        quoteSection: {
            description: "",
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
            calendarSection: {
                title: ""
            },
            accreditationsSection: {
                title: "",
                description: "",
            },
            curriculumSection: {
                title: "",
                description: "",
            },
            kindergartenSection: {
                title: "",
                image: "",
            },
            primarySection: {
                title: "",
                image: "",
            },
            middleSection: {
                title: "",
                image: "",
            },
            quoteSection: {
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

const Academics = () => {
    const [academicData, setAcademicData] = useState({ ...initialObj });
    const [pageData, setPageData] = useState();
    const [isEdit, setIsEdit] = useState(false);
    const [modalShow, setModalShow] = React.useState(false);
    const [imagesData, setImagesData] = useState([]);
    const [isSingle, setIsSingle] = useState(false);
    const [isKindergarten, setIsKindergarten] = useState(false);
    const [isPrimary, setIsPrimary] = useState(false);
    const [isMiddle, setIsMiddle] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isPromoImage, setIsPromoImage] = useState(false);

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
            if (isSingle && !isKindergarten) {
                let updatedImage = { ...academicData };
                updatedImage.content.banner.image = imagesData[index].url;
                setAcademicData(updatedImage);

                // setThumbnailPreview(imagesData.avatar);
                setTimeout(() => {
                    setModalShow(false);
                }, 500);
            }
            if (isKindergarten && !isSingle) {
                let updatedImage = { ...academicData };
                updatedImage.content.kindergartenSection.image = imagesData[index].url;
                setAcademicData(updatedImage);

                // setThumbnailPreview(imagesData.avatar);
                setTimeout(() => {
                    setModalShow(false);
                }, 500);
            }

            if (isPrimary && !isKindergarten && !isSingle) {
                let updatedImage = { ...academicData };
                updatedImage.content.primarySection.image =
                    imagesData[index].url;
                setAcademicData(updatedImage);

                setTimeout(() => {
                    setModalShow(false);
                }, 500);
            }
            if (isMiddle && !isSingle && !isKindergarten && !isPrimary) {
                let updatedImage = { ...academicData };
                updatedImage.content.middleSection.image =
                    imagesData[index].url;
                setAcademicData(updatedImage);

                setTimeout(() => {
                    setModalShow(false);
                }, 500);
            }
            // if (isPromoImage && !isSingle && !isKindergarten && !isSliderThree) {
            //     let updatedImage = { ...academicData };
            //     updatedImage.content.promoSection[
            //         currentIndex
            //     ].images_detail.background_image = imagesData[index].avatar;
            //     setAcademicData(updatedImage);

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
                    let currentPage = response.data.data.find((x) => x.slug === "academics-page");
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
                            setAcademicData({ ...initialObj, content });
                        })
                        .catch((err) => console.log(err));
                }
            })
            .catch((err) => console.log(err));
    }, []);

    //!*********** Handle Banner************
    //! __________Handle OnChange__________
    const handleBannerOnChange = (e) => {
        let updatedValue = { ...academicData };
        updatedValue.content.banner[e.target.name] = e.target.value;
        setAcademicData(updatedValue);
    };
    //! __________Handle  Editor__________
    const handleBannerEditor = (value) => {
        let updatedValue = { ...academicData };
        updatedValue.content.banner.description = value;
        setAcademicData(updatedValue);
    };

    //!*********** Calendar Section************
    //! __________Handle OnChange__________

    const handleCalendarOnChange = (e) => {
        let updatedValue = { ...academicData };
        updatedValue.content.calendarSection[e.target.name] = e.target.value;
        setAcademicData(updatedValue);
    };
    //!*********** Handle Accreditations Section************
    //! __________Handle OnChange__________

    const handleAccreditationsOnChange = (e) => {
        let updatedValue = { ...academicData };
        updatedValue.content.accreditationsSection[e.target.name] = e.target.value;
        setAcademicData(updatedValue);
    };
    //! __________Handle Editor__________
    const handleAccreditationsEditor = (value) => {
        let updatedValue = { ...academicData };
        updatedValue.content.accreditationsSection.description = value;
        setAcademicData(updatedValue);
    };
    //!*********** Handle Curriculum Section************
    //! __________Handle OnChange__________

    const handleCurriculumOnChange = (e) => {
        let updatedValue = { ...academicData };
        updatedValue.content.curriculumSection[e.target.name] = e.target.value;
        setAcademicData(updatedValue);
    };
    //! __________Handle Editor__________
    const handleCurriculumEditor = (value) => {
        let updatedValue = { ...academicData };
        updatedValue.content.curriculumSection.description = value;
        setAcademicData(updatedValue);
    };
    //!*********** Handle Kindergarten Section************
    //! __________Handle OnChange__________

    const handleKindergartenOnChange = (e) => {
        let updatedValue = { ...academicData };
        updatedValue.content.kindergartenSection[e.target.name] = e.target.value;
        setAcademicData(updatedValue);
    };
    //!*********** Handle Primary Section************
    //! __________Handle OnChange__________

    const handlePrimaryOnChange = (e) => {
        let updatedValue = { ...academicData };
        updatedValue.content.primarySection[e.target.name] = e.target.value;
        setAcademicData(updatedValue);
    };
    //!*********** Handle Middle Section************
    //! __________Handle OnChange__________

    const handleMiddleOnChange = (e) => {
        let updatedValue = { ...academicData };
        updatedValue.content.middleSection[e.target.name] = e.target.value;
        setAcademicData(updatedValue);
    };

    //!*********** Handle Quote Section************
    //! __________Handle Editor__________
    const handleQuoteEditor = (value) => {
        let updatedValue = { ...academicData };
        updatedValue.content.quoteSection.description = value;
        setAcademicData(updatedValue);
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
        let updatedValue = { ...academicData };
        updatedValue.content.meta_details[e.target.name] = e.target.value;
        setAcademicData(updatedValue);
    };

    //! *************************************************************
    //? *******************Arabic Section Function*******************
    //! *************************************************************

    //!*********** Handle Banner************
    //! __________Handle OnChange__________
    const handleArabicBannerOnChange = (e) => {
        let updatedValue = { ...academicData };
        updatedValue.content.arabic.banner[e.target.name] =
            e.target.value;
        setAcademicData(updatedValue);
    };
    //! __________Handle  Editor__________
    const handleArabicBannerEditor = (value) => {
        let updatedValue = { ...academicData };
        updatedValue.content.arabic.banner.description = value;
        setAcademicData(updatedValue);
    };
    //!*********** Calendar Section************
    //! __________Handle OnChange__________

    const handleArabicCalendarOnChange = (e) => {
        let updatedValue = { ...academicData };
        updatedValue.content.arabic.calendarSection[e.target.name] =
            e.target.value;
        setAcademicData(updatedValue);
    };
    //!*********** Handle Accreditations Section************
    //! __________Handle OnChange__________

    const handleArabicAccreditationsOnChange = (e) => {
        let updatedValue = { ...academicData };
        updatedValue.content.arabic.accreditationsSection[e.target.name] =
            e.target.value;
        setAcademicData(updatedValue);
    };
    //! __________Handle Editor__________
    const handleArabicAccreditationsEditor = (value) => {
        let updatedValue = { ...academicData };
        updatedValue.content.arabic.accreditationsSection.description = value;
        setAcademicData(updatedValue);
    };
    //!*********** Handle Curriculum Section************
    //! __________Handle OnChange__________

    const handleArabicCurriculumOnChange = (e) => {
        let updatedValue = { ...academicData };
        updatedValue.content.arabic.curriculumSection[e.target.name] =
            e.target.value;
        setAcademicData(updatedValue);
    };
    //! __________Handle Editor__________
    const handleArabicCurriculumEditor = (value) => {
        let updatedValue = { ...academicData };
        updatedValue.content.arabic.curriculumSection.description = value;
        setAcademicData(updatedValue);
    };
    //!*********** Handle Kindergarten Section************
    //! __________Handle OnChange__________
    const handleArabicKindergartenOnChange = (e) => {
        let updatedValue = { ...academicData };
        updatedValue.content.arabic.kindergartenSection[e.target.name] =
            e.target.value;
        setAcademicData(updatedValue);
    };
    //!*********** Handle Primary Section************
    //! __________Handle OnChange__________
    const handleArabicPrimaryOnChange = (e) => {
        let updatedValue = { ...academicData };
        updatedValue.content.arabic.primarySection[e.target.name] =
            e.target.value;
        setAcademicData(updatedValue);
    };
    //!*********** Handle Middle Section************
    //! __________Handle OnChange__________
    const handleArabicMiddleOnChange = (e) => {
        let updatedValue = { ...academicData };
        updatedValue.content.arabic.middleSection[e.target.name] =
            e.target.value;
        setAcademicData(updatedValue);
    };

    //!*********** Handle Quote Section************
    //! __________Handle OnChange__________
    //! __________Handle Editor__________
    const handleArabicQuoteEditor = (value) => {
        let updatedValue = { ...academicData };
        updatedValue.content.arabic.quoteSection.description = value;
        setAcademicData(updatedValue);
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
        let updatedValue = { ...academicData };
        updatedValue.content.arabic.meta_details[e.target.name] =
            e.target.value;
        setAcademicData(updatedValue);
    };
    //! --------------Handle Submit-------------
    const handleSubmit = () => {
        let updatedData = { ...academicData, page_id: pageData._id };
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
                    <CardTitle>Banner Section</CardTitle>
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
                                                    Banner
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
                                                            value={academicData?.content?.banner?.title}
                                                            className={`form-control`}
                                                        />
                                                    </FormGroup>
                                                    <FormGroup className="mb-1">
                                                        <Label for="title">SubTitle</Label>
                                                        <Field
                                                            name="subtitle"
                                                            id="subtitle"
                                                            onChange={handleBannerOnChange}
                                                            value={academicData?.content?.banner?.subtitle}
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
                                                                        academicData?.content?.banner
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
                                                                    {academicData?.content?.banner
                                                                        ?.image !== "" && (
                                                                            <img
                                                                                src={
                                                                                    academicData?.content?.banner
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
                                                                        setIsKindergarten(false);
                                                                        setIsPrimary(false);
                                                                        setIsMiddle(false);
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
            {/* //! **************Calendar  Section*************** */}
            <Card className="slider-bottom-section">
                <CardHeader>
                    <CardTitle>Calendar Section</CardTitle>
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
                                                    Calendar
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
                                                            onChange={handleCalendarOnChange}
                                                            value={
                                                                academicData?.content?.calendarSection?.title
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
            {/* //! **************ACCREDITATIONS Section*************** */}
            <Card className="welcome-section">
                <CardHeader>
                    <CardTitle>Accreditations Section</CardTitle>
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
                                                    Accreditations
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
                                                            onChange={handleAccreditationsOnChange}
                                                            value={
                                                                academicData?.content?.accreditationsSection?.title
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
                                                                        academicData?.content?.accreditationsSection
                                                                            ?.description
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleAccreditationsEditor(e.editor.getData())
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
            {/* //! **************Curriculum Section*************** */}
            <Card className="slider-bottom-section">
                <CardHeader>
                    <CardTitle>Curriculum Section</CardTitle>
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
                                                    Curriculum
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
                                                            onChange={handleCurriculumOnChange}
                                                            value={
                                                                academicData?.content?.curriculumSection?.title
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
                                                                        academicData?.content?.curriculumSection
                                                                            ?.description
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleCurriculumEditor(e.editor.getData())
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
                                {/******************************Kindergarten******************************/}
                                <div className="variation-row-wrapper mb-2">
                                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                        <Card>
                                            <CardHeader id="item-5">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Kindergarten
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
                                                            onChange={handleKindergartenOnChange}
                                                            value={
                                                                academicData?.content?.kindergartenSection?.title
                                                            }
                                                            className={`form-control`}
                                                        />
                                                    </FormGroup>
                                                    <Row>
                                                        <Col sm={4}>
                                                            <FormGroup className="">
                                                                <Label for="video_thumbnail">
                                                                    Upload Image
                                                                </Label>
                                                                <div className="clearfix" />
                                                                <div className="img-preview-wrapper">
                                                                    {academicData?.content?.kindergartenSection
                                                                        ?.image !== "" && (
                                                                            <img
                                                                                src={
                                                                                    academicData?.content?.kindergartenSection
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
                                                                        setIsKindergarten(true);
                                                                        setIsPrimary(false);
                                                                        setIsMiddle(false);
                                                                        setModalShow(true);
                                                                    }}
                                                                >
                                                                    Kindergarten Image
                                                                </Button.Ripple>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </UncontrolledCollapse>
                                        </Card>
                                    </div>
                                </div>

                                {/******************************Primary School******************************/}

                                <div className="variation-row-wrapper mb-2">
                                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                        <Card>
                                            <CardHeader id="item-6">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Primary School
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
                                                            onChange={handlePrimaryOnChange}
                                                            value={
                                                                academicData?.content?.primarySection?.title
                                                            }
                                                            className={`form-control`}
                                                        />
                                                    </FormGroup>
                                                    <Row>
                                                        <Col sm={4}>
                                                            <FormGroup className="">
                                                                <Label for="video_thumbnail">
                                                                    Upload Image
                                                                </Label>
                                                                <div className="clearfix" />
                                                                <div className="img-preview-wrapper">
                                                                    {academicData?.content?.primarySection
                                                                        ?.image !== "" && (
                                                                            <img
                                                                                src={
                                                                                    academicData?.content?.primarySection
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
                                                                        setIsKindergarten(false);
                                                                        setIsPrimary(true);
                                                                        setIsMiddle(false);
                                                                        setModalShow(true);
                                                                    }}
                                                                >
                                                                    Primary Image
                                                                </Button.Ripple>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </UncontrolledCollapse>
                                        </Card>
                                    </div>
                                </div>

                                {/******************************Middle School******************************/}

                                <div className="variation-row-wrapper mb-2">
                                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                        <Card>
                                            <CardHeader id="item-7">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Middle School
                                                </CardTitle>
                                                {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                            </CardHeader>
                                            <UncontrolledCollapse toggler="#item-7">
                                                <CardBody>
                                                    <FormGroup className="mb-1">
                                                        <Label for="title">Title</Label>
                                                        <Field
                                                            name="title"
                                                            id="title"
                                                            onChange={handleMiddleOnChange}
                                                            value={
                                                                academicData?.content?.middleSection?.title
                                                            }
                                                            className={`form-control`}
                                                        />
                                                    </FormGroup>
                                                    <Row>
                                                        <Col sm={4}>
                                                            <FormGroup className="">
                                                                <Label for="video_thumbnail">
                                                                    Upload Image
                                                                </Label>
                                                                <div className="clearfix" />
                                                                <div className="img-preview-wrapper">
                                                                    {academicData?.content?.middleSection
                                                                        ?.image !== "" && (
                                                                            <img
                                                                                src={
                                                                                    academicData?.content?.middleSection
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
                                                                        setIsKindergarten(false);
                                                                        setIsPrimary(false);
                                                                        setIsMiddle(true);
                                                                        setModalShow(true);
                                                                    }}
                                                                >
                                                                    Middle Image
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
            {/* //! **************Quote  Section*************** */}
            <Card className="slider-bottom-section">
                <CardHeader>
                    <CardTitle>Quote Section</CardTitle>
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
                                            <CardHeader id="item-8">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Quote
                                                </CardTitle>
                                                {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                            </CardHeader>
                                            <UncontrolledCollapse toggler="#item-8">
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
                                                                        academicData?.content?.quoteSection
                                                                            ?.description
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleQuoteEditor(e.editor.getData())
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
                                                value={academicData?.content?.meta_details?.title}
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
                                                    academicData?.content?.meta_details?.description
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
                                                    academicData?.content?.meta_details?.schema_markup
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
                        <CardTitle>Arabic Banner Section</CardTitle>
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
                                                        Banner
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
                                                                onChange={handleArabicBannerOnChange}
                                                                value={
                                                                    academicData?.content?.arabic?.banner
                                                                        ?.title
                                                                }
                                                                className={`form-control`}
                                                            />
                                                        </FormGroup>
                                                        <FormGroup className="mb-1">
                                                            <Label for="title">SubTitle</Label>
                                                            <Field
                                                                name="subtitle"
                                                                id="subtitle"
                                                                onChange={handleArabicBannerOnChange}
                                                                value={
                                                                    academicData?.content?.arabic?.banner
                                                                        ?.subtitle
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
                                                                            academicData?.content?.arabic
                                                                                ?.banner?.description
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleArabicBannerEditor(
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
                {/* //! **************Calender Section*************** */}
                <Card className="arabic-slider-bottom-section">
                    <CardHeader>
                        <CardTitle>Calender Section</CardTitle>
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
                                                        Calender
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
                                                                    academicData?.content?.arabic?.calendarSection
                                                                        ?.title
                                                                }
                                                                onChange={handleArabicCalendarOnChange}
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
                {/* //! **************Accreditations Section*************** */}
                <Card className="arabic-welcome-section">
                    <CardHeader>
                        <CardTitle>Accreditations Section</CardTitle>
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
                                                        Accreditations
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
                                                                onChange={handleArabicAccreditationsOnChange}
                                                                value={
                                                                    academicData?.content?.arabic
                                                                        ?.accreditationsSection?.title
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
                                                                            academicData?.content?.arabic
                                                                                ?.accreditationsSection?.description
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleArabicAccreditationsEditor(
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
                {/* //! **************Curriculum Section*************** */}
                <Card className="arabic-slider-bottom-section">
                    <CardHeader>
                        <CardTitle>Curriculum Section</CardTitle>
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
                                                        Curriculum
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
                                                                onChange={handleArabicCurriculumOnChange}
                                                                value={
                                                                    academicData?.content?.arabic
                                                                        ?.curriculumSection?.title
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
                                                                            academicData?.content?.arabic
                                                                                ?.curriculumSection?.description
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleArabicCurriculumEditor(
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
                                    {/**********************Kindergarten Access ***************/}
                                    <div className="variation-row-wrapper mb-2">
                                        <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                            <Card>
                                                <CardHeader id="item-5">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        Kindergarten
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
                                                                value={
                                                                    academicData?.content?.arabic?.kindergartenSection
                                                                        ?.title
                                                                }
                                                                onChange={handleArabicKindergartenOnChange}
                                                                className={`form-control`}
                                                            />
                                                        </FormGroup>
                                                    </CardBody>
                                                </UncontrolledCollapse>
                                            </Card>
                                        </div>
                                    </div>

                                    {/**********************primary school ***************/}
                                    <div className="variation-row-wrapper mb-2">
                                        <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                            <Card>
                                                <CardHeader id="item-6">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        Primary School
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
                                                                value={
                                                                    academicData?.content?.arabic?.primarySection
                                                                        ?.title
                                                                }
                                                                onChange={handleArabicPrimaryOnChange}
                                                                className={`form-control`}
                                                            />
                                                        </FormGroup>
                                                    </CardBody>
                                                </UncontrolledCollapse>
                                            </Card>
                                        </div>
                                    </div>

                                    {/**********************Middle School ***************/}
                                    <div className="variation-row-wrapper mb-2">
                                        <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                            <Card>
                                                <CardHeader id="item-7">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        Middle School
                                                    </CardTitle>
                                                    {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                                </CardHeader>
                                                <UncontrolledCollapse toggler="#item-7">
                                                    <CardBody>
                                                        <FormGroup className="mb-1">
                                                            <Label for="title">Title</Label>
                                                            <Field
                                                                name="title"
                                                                id="title"
                                                                value={
                                                                    academicData?.content?.arabic?.middleSection
                                                                        ?.title
                                                                }
                                                                onChange={handleArabicMiddleOnChange}
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
                {/* //! **************Quote Section*************** */}
                <Card className="arabic-welcome-section">
                    <CardHeader>
                        <CardTitle>Quote Section</CardTitle>
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
                                                <CardHeader id="item-8">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        Quote
                                                    </CardTitle>
                                                    {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                                </CardHeader>
                                                <UncontrolledCollapse toggler="#item-8">
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
                                                                            academicData?.content?.arabic
                                                                                ?.quoteSection?.description
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleArabicQuoteEditor(
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
                                                        academicData?.content?.arabic?.meta_details
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
                                                        academicData?.content?.arabic?.meta_details
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
                                                        academicData?.content?.arabic?.meta_details
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

export default Academics;
