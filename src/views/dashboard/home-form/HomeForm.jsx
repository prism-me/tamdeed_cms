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
import "./HomeForm.scss";
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
  name: "home-page",
  page_id: 0,
  slug: "home-page",
  content: {
    banner: {
      title: "",
      subtitle: "",
      video_link: "",
      description: "",
      image: "",
    },
    curriculmSection: {
      title: "",
      subtitle: "",
      description: "",
    },
    covidSection: {
      title: "",
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
      curriculmSection: {
        title: "",
        subtitle: "",
        description: "",
      },
      covidSection: {
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

const HomeForm = () => {
  const [homeData, setHomeData] = useState({ ...initialObj });
  const [pageData, setPageData] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [imagesData, setImagesData] = useState([]);
  const [isSingle, setIsSingle] = useState(false);
  const [isSliderThree, setIsSliderThree] = useState(false);
  const [isSliderTwo, setIsSliderTwo] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPromoImage, setIsPromoImage] = useState(false);

  //******************Gallery
  useEffect(() => {
    API.get('get_all_images')
      .then((response) => {
        // debugger;
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
      if (isSingle && !isSliderTwo) {
        let updatedImage = { ...homeData };
        updatedImage.content.banner.image = imagesData[index].url;
        setHomeData(updatedImage);

        // setThumbnailPreview(imagesData.avatar);
        setTimeout(() => {
          setModalShow(false);
        }, 500);
      }
      // if (isSliderTwo && !isSingle) {
      //   let updatedImage = { ...homeData };
      //   updatedImage.widget_content.sliderTwo.image = imagesData[index].avatar;
      //   setHomeData(updatedImage);

      //   // setThumbnailPreview(imagesData.avatar);
      //   setTimeout(() => {
      //     setModalShow(false);
      //   }, 500);
      // }

      // if (isSliderThree && !isSliderTwo && !isSingle) {
      //   let updatedImage = { ...homeData };
      //   updatedImage.widget_content.sliderThree.image =
      //     imagesData[index].avatar;
      //   setHomeData(updatedImage);

      //   setTimeout(() => {
      //     setModalShow(false);
      //   }, 500);
      // }
      // if (isPromoImage && !isSingle) {
      //   let updatedImage = { ...homeData };
      //   updatedImage.content.promoSection[
      //     currentIndex
      //   ].images_detail.background_image = imagesData[index].avatar;
      //   setHomeData(updatedImage);

      //   setTimeout(() => {
      //     setModalShow(false);
      //   }, 500);
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
          let currentPage = response.data.data.find((x) => x.slug === "home-page");
          setPageData(currentPage);
          API.get(`/all_sections/${currentPage._id}`)
            // API.get(`/all_sections/${page_id}`)
            .then((res) => {
              // debugger;
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
              setHomeData({ ...initialObj, content });
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  //!*********** Handle Banner************
  //! __________Handle OnChange__________
  const handleBannerOnChange = (e) => {
    let updatedValue = { ...homeData };
    updatedValue.content.banner[e.target.name] = e.target.value;
    setHomeData(updatedValue);
  };
  //! __________Handle  Editor__________
  const handleBannerEditor = (value) => {
    let updatedValue = { ...homeData };
    updatedValue.content.banner.description = value;
    setHomeData(updatedValue);
  };

  //!*********** Handle Curriculum Section************
  //! __________Handle OnChange__________

  const handleCurriculumOnChange = (e) => {
    let updatedValue = { ...homeData };
    updatedValue.content.curriculmSection[e.target.name] = e.target.value;
    setHomeData(updatedValue);
  };
  //! __________Handle Editor__________
  const handleCurriculumEditor = (value) => {
    let updatedValue = { ...homeData };
    updatedValue.content.curriculmSection.description = value;
    setHomeData(updatedValue);
  };
  //!*********** Handle Welcome Section************
  //! __________Handle OnChange__________

  const handleCovidOnChange = (e) => {
    let updatedValue = { ...homeData };
    updatedValue.content.covidSection[e.target.name] = e.target.value;
    setHomeData(updatedValue);
  };
  //! __________Handle Editor__________
  const handleCovidEditor = (value) => {
    let updatedValue = { ...homeData };
    updatedValue.content.covidSection.description = value;
    setHomeData(updatedValue);
  };

  // //!----------ADD New Section------
  // const addNewSection = () => {
  //   let updatedValue = { ...homeData };
  //   updatedValue.widget_content.promoSection.push({
  //     video_link: "",
  //     images_detail: {
  //       title: "",
  //       content: "",
  //       background_image: "",
  //     },
  //   });
  //   setHomeData(updatedValue);
  // };
  // //!--------Remove section------
  // const removeSection = (index) => {
  //   let updatedValue = { ...homeData };
  //   let updatedSection = updatedValue.widget_content.promoSection.filter(
  //     (x, i) => i !== index
  //   );
  //   updatedValue.widget_content.promoSection = updatedSection;
  //   setHomeData(updatedValue);
  // };
  //!--------Hanlde Meta Details OnChange---------
  const handleMetaOnChange = (e) => {
    let updatedValue = { ...homeData };
    updatedValue.content.meta_details[e.target.name] = e.target.value;
    setHomeData(updatedValue);
  };

  //! *************************************************************
  //? *******************Arabic Section Function*******************
  //! *************************************************************

  //!*********** Handle Banner************
  //! __________Handle OnChange__________
  const handleArabicBannerOnChange = (e) => {
    let updatedValue = { ...homeData };
    updatedValue.content.arabic.banner[e.target.name] =
      e.target.value;
    setHomeData(updatedValue);
  };
  //! __________Handle  Editor__________
  const handleArabicBannerEditor = (value) => {
    let updatedValue = { ...homeData };
    updatedValue.content.arabic.banner.description = value;
    setHomeData(updatedValue);
  };

  //!*********** Handle Curriculum Section************
  //! __________Handle OnChange__________

  const handleArabicCurriculumOnChange = (e) => {
    let updatedValue = { ...homeData };
    updatedValue.content.arabic.curriculmSection[e.target.name] =
      e.target.value;
    setHomeData(updatedValue);
  };
  //! __________Handle Editor__________
  const handleArabicCurriculumEditor = (value) => {
    let updatedValue = { ...homeData };
    updatedValue.content.arabic.curriculmSection.description = value;
    setHomeData(updatedValue);
  };
  //!*********** Handle Covid Section************
  //! __________Handle OnChange__________

  const handleArabicCovidOnChange = (e) => {
    let updatedValue = { ...homeData };
    updatedValue.content.arabic.covidSection[e.target.name] =
      e.target.value;
    setHomeData(updatedValue);
  };
  //! __________Handle Editor__________
  const handleArabicCovidEditor = (value) => {
    let updatedValue = { ...homeData };
    updatedValue.content.arabic.covidSection.description = value;
    setHomeData(updatedValue);
  };
  // //!----------ADD New Section------
  // const addArabicNewSection = () => {
  //   let updatedValue = { ...homeData };
  //   updatedValue.widget_content.arabic.promoSection.push({
  //     images_detail: {
  //       title: "",
  //       content: "",
  //     },
  //   });
  //   setHomeData(updatedValue);
  // };
  // //!--------Remove section------
  // const removeArabicSection = (index) => {
  //   let updatedValue = { ...homeData };
  //   let updatedSection = updatedValue.widget_content.arabic.promoSection.filter(
  //     (x, i) => i !== index
  //   );
  //   updatedValue.widget_content.arabic.promoSection = updatedSection;
  //   setHomeData(updatedValue);
  // };
  //!--------Hanlde Meta Details OnChange---------
  const handleArabicMetaOnChange = (e) => {
    let updatedValue = { ...homeData };
    updatedValue.content.arabic.meta_details[e.target.name] =
      e.target.value;
    setHomeData(updatedValue);
  };
  //! --------------Handle Submit-------------
  const handleSubmit = () => {
    let updatedData = { ...homeData, page_id: pageData._id };
    API.post(`/sections`, updatedData)
      .then((response) => {
        // debugger;
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
                {/* //! **************Banner************** */}
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
                              value={homeData?.content?.banner?.title}
                              className={`form-control`}
                            />
                          </FormGroup>
                          <FormGroup className="mb-1">
                            <Label for="title">SubTitle</Label>
                            <Field
                              name="subtitle"
                              id="subtitle"
                              onChange={handleBannerOnChange}
                              value={homeData?.content?.banner?.subtitle}
                              className={`form-control`}
                            />
                          </FormGroup>
                          <FormGroup className="mb-1">
                            <Label for="video_link">Url</Label>
                            <Field
                              name="video_link"
                              id="video_link"
                              onChange={handleBannerOnChange}
                              value={homeData?.content?.banner?.video_link}
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
                                    homeData?.content?.banner
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
                                  {homeData?.content?.banner
                                    ?.image !== "" && (
                                      <img
                                        src={
                                          homeData?.content?.banner
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
      {/* //! **************CURRICULUM  Section*************** */}
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
                      <CardHeader id="item-2">
                        <CardTitle className="lead collapse-title collapsed">
                          Curriculum
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
                              onChange={handleCurriculumOnChange}
                              value={
                                homeData?.content?.curriculmSection?.title
                              }
                              className={`form-control`}
                            />
                          </FormGroup>
                          <FormGroup className="mb-1">
                            <Label for="subtitle">SubTitle</Label>
                            <Field
                              name="subtitle"
                              id="subtitle"
                              onChange={handleCurriculumOnChange}
                              value={
                                homeData?.content?.curriculmSection?.subtitle
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
                                    homeData?.content?.curriculmSection
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
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
      {/* //! **************COVID Section*************** */}
      <Card className="welcome-section">
        <CardHeader>
          <CardTitle>Covid Section</CardTitle>
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
                          Covid
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
                              onChange={handleCovidOnChange}
                              value={
                                homeData?.content?.covidSection?.title
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
                                    homeData?.content?.covidSection
                                      ?.description
                                  }
                                  onChange={(e) =>
                                    handleCovidEditor(e.editor.getData())
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
                        value={homeData?.content?.meta_details?.title}
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
                          homeData?.content?.meta_details?.description
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
                          homeData?.content?.meta_details?.schema_markup
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
                  {/* //! **************Banner************** */}
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
                                  homeData?.content?.arabic?.banner
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
                                  homeData?.content?.arabic?.banner
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
                                      homeData?.content?.arabic
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
                        <CardHeader id="item-2">
                          <CardTitle className="lead collapse-title collapsed">
                            Curriculum
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
                                  homeData?.content?.arabic?.curriculmSection
                                    ?.title
                                }
                                onChange={handleArabicCurriculumOnChange}
                                className={`form-control`}
                              />
                            </FormGroup>
                            <FormGroup className="mb-1">
                              <Label for="subtitle">SubTitle</Label>
                              <Field
                                name="subtitle"
                                id="subtitle"
                                value={
                                  homeData?.content?.arabic?.curriculmSection
                                    ?.subtitle
                                }
                                onChange={handleArabicCurriculumOnChange}
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
                                      homeData?.content?.arabic
                                        ?.curriculmSection?.description
                                    }
                                    onChange={(e) =>
                                      handleArabicCurriculumEditor(e.editor.getData())
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
        {/* //! **************Covid Section*************** */}
        <Card className="arabic-welcome-section">
          <CardHeader>
            <CardTitle>Covid Section</CardTitle>
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
                            Covid
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
                                onChange={handleArabicCovidOnChange}
                                value={
                                  homeData?.content?.arabic
                                    ?.covidSection?.title
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
                                      homeData?.content?.arabic
                                        ?.covidSection?.description
                                    }
                                    onChange={(e) =>
                                      handleArabicCovidEditor(
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
                            homeData?.content?.arabic?.meta_details
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
                            homeData?.content?.arabic?.meta_details
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
                            homeData?.content?.arabic?.meta_details
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

export default HomeForm;
