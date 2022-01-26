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
    name: "about",
    page_id: "61efa8763814553528375cb2",
    slug: "about",
    content: {
        banner: {
            title: "",
            image: "",
        },
        overview: {
            title: "",
            subtitle: "",
            description: "",
            hidden_description: "",
            image: "",
        },
        executiveManagement: [
          {
            name: "",
            designation: "",
            quotation: "",
            image: "",
        },
        {
          name: "",
          designation: "",
          quotation: "",
          image: "",
        }
        ],
        meta_details: {
            title: "",
            description: "",
            schema_markup: "",
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
    const [isOverView, setIsOverview] = useState(false);
    const [isBanner, setIsBanner] = useState(false);
    const [isExecutiveManagement, setIsExecutiveManagement] = useState({value:false,index:0});
    const [isAbout, setIsAbout] = useState(false);
    const [isHealth, setIsHealth] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isPromoImage, setIsPromoImage] = useState(false);
    const [sectionID, setSectionID] = useState(0);

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
            if (isOverView && !isExecutiveManagement.value && !isBanner && !isAbout && !isSingle) {
              let updatedImage = { ...aboutData };
              updatedImage.content.overview.image =
                  imagesData[index].url;
              setAboutData(updatedImage);

              setTimeout(() => {
                  setModalShow(false);
              }, 500);
            }

            if (isBanner && !isExecutiveManagement.value && !isAbout && !isSingle && !isOverView) {
              let updatedImage = { ...aboutData };
              updatedImage.content.banner.image =
                  imagesData[index].url;
              setAboutData(updatedImage);

              setTimeout(() => {
                  setModalShow(false);
              }, 500);
            }

            if (isExecutiveManagement.value && !isBanner && !isAbout && !isSingle && !isOverView) {
              let updatedImage = { ...aboutData };
              updatedImage.content.executiveManagement[isExecutiveManagement.index - 1].image =
                  imagesData[index].url;
              setAboutData(updatedImage);

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
                    let currentPage = response.data.data.find((x) => x.slug === "about");
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
                            let content = res.data.data[res.data.data.length - 1].content;
                            setSectionID(res.data.data[res.data.data.length - 1]._id);
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
    const handleOverviewOnChange = (e) => {
        let updatedValue = { ...aboutData };
        updatedValue.content.overview[e.target.name] = e.target.value;
        setAboutData(updatedValue);
    };
    const executiveManagementOnChange = (e,index) => {
        let updatedValue = { ...aboutData };
        updatedValue.content.executiveManagement[index][e.target.name] = e.target.value;
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
        if(sectionID){
          API.put(`/sections/${sectionID}`, updatedData)
          .then((response) => {
              alert("Data updated successfully");
              window.location.reload();
          })
          .catch((err) =>
              alert(
                  "Something went wrong, Please check your internet connect and reload page"
              )
          );
        } else {
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
        }

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
                                                            value={aboutData?.content?.banner?.title}
                                                            className={`form-control`}
                                                        />
                                                    </FormGroup>
                                                    <Row>
                                                        <Col sm={6}>
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
                                                                        // setIsSingle(true);
                                                                        setIsAbout(false);
                                                                        setIsPrincipal(false);
                                                                        setIsHealth(false);
                                                                        setModalShow(true);
                                                                        setIsOverview(false);
                                                                        setIsBanner(true);
                                                                        setIsExecutiveManagement({value : false, index : 0});
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
                                            <CardHeader id="item-11">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Overview
                                                </CardTitle>
                                                {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                            </CardHeader>
                                            <UncontrolledCollapse toggler="#item-11">
                                                <CardBody>
                                                    <FormGroup className="mb-1">
                                                        <Label for="title">Title</Label>
                                                        <Field
                                                            name="title"
                                                            id="title"
                                                            onChange={handleOverviewOnChange}
                                                            value={aboutData?.content?.overview?.title}
                                                            className={`form-control`}
                                                        />
                                                    </FormGroup>
                                                    <FormGroup className="mb-1">
                                                        <Label for="title">SubTitle</Label>
                                                        <Field
                                                            name="subtitle"
                                                            id="subtitle"
                                                            onChange={handleOverviewOnChange}
                                                            value={aboutData?.content?.overview?.subtitle}
                                                            className={`form-control`}
                                                        />
                                                    </FormGroup>
                                                    <Row>
                                                        <Col sm={9}>
                                                            <FormGroup className="mb-1">
                                                              <Label for="name">Short Description</Label>
                                                              {/* <Field
                                                                  name="description"
                                                                  id="description"
                                                                  onChange={handleFieldChange}
                                                                  value={industry.description}
                                                                  className={`form-control`}
                                                              /> */}
                                                              <Input
                                                                  name="description"
                                                                  id="description"
                                                                  onChange={handleOverviewOnChange}
                                                                  value={aboutData?.content?.overview?.description}
                                                                  className={`form-control`}
                                                                  type="textarea"
                                                                  rows="4"
                                                              />
                                                            </FormGroup>
                                                            <FormGroup className="mb-1">
                                                              <Label for="name">Hidden Description</Label>
                                                              {/* <Field
                                                                  name="description"
                                                                  id="description"
                                                                  onChange={handleFieldChange}
                                                                  value={industry.description}
                                                                  className={`form-control`}
                                                              /> */}
                                                              <Input
                                                                  name="hidden_description"
                                                                  id="hidden_description"
                                                                  onChange={handleOverviewOnChange}
                                                                  value={aboutData?.content?.overview?.hidden_description}
                                                                  className={`form-control`}
                                                                  type="textarea"
                                                                  rows="4"
                                                              />
                                                            </FormGroup>

                                                        </Col>
                                                        <Col sm={3}>
                                                            <FormGroup className="">
                                                                <Label for="video_thumbnail">
                                                                    Upload Image
                                                                </Label>
                                                                <div className="clearfix" />
                                                                <div className="img-preview-wrapper">
                                                                    {aboutData?.content?.overview
                                                                        ?.image !== "" && (
                                                                            <img
                                                                                src={
                                                                                    aboutData?.content?.overview
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
                                                                        // setIsSingle(true);
                                                                        setIsAbout(false);
                                                                        setIsPrincipal(false);
                                                                        setIsHealth(false);
                                                                        setModalShow(true);
                                                                        setIsOverview(true);
                                                                        setIsBanner(false);
                                                                        setIsExecutiveManagement({value : false, index : 0});
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

          {false &&  <Card className="slider-bottom-section">
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
          }
            {/* //! **************About  Section*************** */}
            <Card className="slider-bottom-section">
                <CardHeader>
                    <CardTitle>Executive Management Section</CardTitle>
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
                                                  {aboutData?.content?.executiveManagement?.map((x, index) => (
                                                  <Row>
                                                  <Col sm={9}>
                                                    <FormGroup className="mb-1">
                                                      <Label for="name">Name</Label>
                                                      <Field
                                                          name="name"
                                                          id="name"
                                                          onChange={(e) => executiveManagementOnChange(e,index)}
                                                          value={x.name}
                                                          className={`form-control`}
                                                      />
                                                    </FormGroup>
                                                    <FormGroup className="mb-1">
                                                      <Label for="designation">designation</Label>
                                                      <Field
                                                          name="designation"
                                                          id="designation"
                                                          onChange={(e) => executiveManagementOnChange(e,index)}
                                                          value={x.designation}
                                                          className={`form-control`}
                                                      />
                                                    </FormGroup>
                                                    <FormGroup className="mb-1">
                                                        <Label for="quotation">Quotation</Label>
                                                        <Input
                                                            name="quotation"
                                                            id="quotation"
                                                            onChange={(e) => executiveManagementOnChange(e,index)}
                                                            value={x.quotation}
                                                            className={`form-control`}
                                                            type="textarea"
                                                            rows="4"
                                                        />
                                                      </FormGroup>
                                                  </Col>
                                                  <Col sm={3}>
                                                      <FormGroup className="">
                                                          <Label for="video_thumbnail">
                                                              Upload Image
                                                          </Label>
                                                          <div className="clearfix" />
                                                          <div className="img-preview-wrapper">
                                                              {x.image !== "" && (
                                                                      <img
                                                                          src={ x.image }
                                                                          alt=""
                                                                      />
                                                                  )}
                                                          </div>
                                                          <Button.Ripple
                                                              color="primary"
                                                              className="p-1"
                                                              onClick={() => {
                                                                  setIsSingle(false);
                                                                  setIsAbout(false);
                                                                  setIsPrincipal(false);
                                                                  setIsHealth(false);
                                                                  setModalShow(true);
                                                                  setIsOverview(false);
                                                                  setIsBanner(false);
                                                                  setIsExecutiveManagement({value : true, index : index + 1});
                                                              }}
                                                          >
                                                              Featured Image
                                                          </Button.Ripple>
                                                      </FormGroup>
                                                  </Col>
                                              </Row>
                                                ))}

                                                </CardBody>
                                                {/* <CardBody>
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
                                                </CardBody> */}
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
            <div className="submit-btn-wrap">
                    <Button.Ripple onClick={handleSubmit} color="primary" type="submit">
                        Submit
                    </Button.Ripple>
            </div>


        </>
    );
};

export default AboutUs;
