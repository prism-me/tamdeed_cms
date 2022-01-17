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
import "./AgsPortal.scss";
import CKEditor from "ckeditor4-react";
import { ckEditorConfig } from "../../../utils/data";
import { DeleteOutlined } from "@material-ui/icons";
import { API } from "../../../http/API";
import Grid from "@material-ui/core/Grid";

const formSchema = Yup.object().shape({
  required: Yup.string().required("Required"),
});

const initialObj = {
  name: "ags-portal",
  page_id: 3,
  slug: "ags-portal",
  content: {
    portalContent: {
      description: "",
    },
    parentSection: {
      title: "",
      url: "",
    },
    staffSection: {
      title: "",
      url: "",
    },
    studentSection: {
      title: "",
      url: "",
    },
    contactSection: {
      title: "",
      email: "",
      phone: "",
    },
    meta_details: {
      title: "",
      description: "",
      schema_markup: "",
    },
    arabic: {
      portalContent: {
        description: "",
      },
      parentSection: {
        title: "",
      },
      staffSection: {
        title: "",
      },
      studentSection: {
        title: "",
      },
      contactSection: {
        title: "",
        email: "",
        phone: "",
      },
      meta_details: {
        title: "",
        description: "",
        schema_markup: "",
      },
    },
  },
};

const AgsPortal = () => {
  const [portalData, setPortalData] = useState({ ...initialObj });
  const [pageData, setPageData] = useState();

  //!------------Pages Api Call------------
  useEffect(() => {
    API.get(`/pages`)
      .then((response) => {
        // debugger;
        if (response.status === 200 || response.status === 201) {
          let currentPage = response.data.data.find((x) => x.slug === "ags-portal");
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
              setPortalData({ ...initialObj, content });
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  //!*********** Handle Portal Content Section************
  //! __________Handle  Editor__________
  const handlePortalEditor = (value) => {
    let updatedValue = { ...portalData };
    updatedValue.content.portalContent.description = value;
    setPortalData(updatedValue);
  };
  //! *********** Handle Parent Section************
  //! __________Handle OnChange__________

  const handleParentOnChange = (e) => {
    let updatedValue = { ...portalData };
    updatedValue.content.parentSection[e.target.name] = e.target.value;
    setPortalData(updatedValue);
  };
  //!*********** Handle Staff Section************
  //! __________Handle OnChange__________

  const handleStaffOnChange = (e) => {
    let updatedValue = { ...portalData };
    updatedValue.content.staffSection[e.target.name] = e.target.value;
    setPortalData(updatedValue);
  };

  //!*********** Handle Student Section************
  //! __________Handle OnChange__________

  const handleStudentOnChange = (e) => {
    let updatedValue = { ...portalData };
    updatedValue.content.studentSection[e.target.name] = e.target.value;
    setPortalData(updatedValue);
  };

  //!*********** Handle Contact Section************
  //! __________Handle OnChange__________

  const handleContactOnChange = (e) => {
    let updatedValue = { ...portalData };
    updatedValue.content.contactSection[e.target.name] = e.target.value;
    setPortalData(updatedValue);
  };

  // //!----------ADD New Section------
  // const addNewSection = () => {
  //   let updatedValue = { ...homeData };
  //   updatedValue.content.promoSection.push({
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
  //   let updatedSection = updatedValue.content.promoSection.filter(
  //     (x, i) => i !== index
  //   );
  //   updatedValue.content.promoSection = updatedSection;
  //   setHomeData(updatedValue);
  // };

  //!--------Hanlde Meta Details OnChange---------
  const handleMetaOnChange = (e) => {
    let updatedValue = { ...portalData };
    updatedValue.content.meta_details[e.target.name] = e.target.value;
    setPortalData(updatedValue);
  };

  //! *************************************************************
  //? *******************Arabic Section Function*******************
  //! *************************************************************

  //!*********** Handle Portal Content Section************
  //! __________Handle  Editor__________
  const handleArabicPortalEditor = (value) => {
    let updatedValue = { ...portalData };
    updatedValue.content.arabic.portalContent.description = value;
    setPortalData(updatedValue);
  };
  //! *********** Handle Parent Section************
  //! __________Handle OnChange__________
  const handleArabicParentOnChange = (e) => {
    let updatedValue = { ...portalData };
    updatedValue.content.arabic.parentSection[e.target.name] =
      e.target.value;
    setPortalData(updatedValue);
  };

  //! *********** Handle Staff Section************
  //! __________Handle OnChange__________
  const handleArabicStaffOnChange = (e) => {
    let updatedValue = { ...portalData };
    updatedValue.content.arabic.staffSection[e.target.name] =
      e.target.value;
    setPortalData(updatedValue);
  };

  //! *********** Handle Student Section************
  //! __________Handle OnChange__________
  const handleArabicStudentOnChange = (e) => {
    let updatedValue = { ...portalData };
    updatedValue.content.arabic.studentSection[e.target.name] =
      e.target.value;
    setPortalData(updatedValue);
  };

  //! *********** Handle Contact Section************
  //! __________Handle OnChange__________
  const handleArabicContactOnChange = (e) => {
    let updatedValue = { ...portalData };
    updatedValue.content.arabic.contactSection[e.target.name] =
      e.target.value;
    setPortalData(updatedValue);
  };

  // //!----------ADD New Section------
  // const addArabicNewSection = () => {
  //   let updatedValue = { ...homeData };
  //   updatedValue.content.arabic.promoSection.push({
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
  //   let updatedSection = updatedValue.content.arabic.promoSection.filter(
  //     (x, i) => i !== index
  //   );
  //   updatedValue.content.arabic.promoSection = updatedSection;
  //   setHomeData(updatedValue);
  // };


  //!--------Hanlde Meta Details OnChange---------
  const handleArabicMetaOnChange = (e) => {
    let updatedValue = { ...portalData };
    updatedValue.content.arabic.meta_details[e.target.name] =
      e.target.value;
    setPortalData(updatedValue);
  };
  //! --------------Handle Submit-------------
  const handleSubmit = () => {
    let updatedData = { ...portalData, page_id: pageData._id };
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
          <CardTitle>AGS Portal Content Section</CardTitle>
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
                {/* //! **************CONTENT SECTION************** */}
                <div className="variation-row-wrapper mb-2">
                  <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                    <Card>
                      <CardHeader id="item-1">
                        <CardTitle className="lead collapse-title collapsed">
                          AGS Portal Content
                        </CardTitle>
                        {/* <ChevronDown size={15} className="collapse-icon" /> */}
                      </CardHeader>
                      <UncontrolledCollapse toggler="#item-1">
                        <CardBody>
                          <Row>
                            <Col sm>
                              <div>
                                <Label for="content">Content</Label>
                                <CKEditor
                                  config={ckEditorConfig}
                                  onBeforeLoad={(CKEDITOR) =>
                                    (CKEDITOR.disableAutoInline = true)
                                  }
                                  data={
                                    portalData?.content?.portalContent
                                      ?.description
                                  }
                                  onChange={(e) =>
                                    handlePortalEditor(e.editor.getData())
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
      {/* //! **************Access Section*************** */}
      <Card className="slider-bottom-section">
        <CardHeader>
          <CardTitle>Access Section</CardTitle>
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

                {/******************************Parent Access******************************/}
                <div className="variation-row-wrapper mb-2">
                  <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                    <Card>
                      <CardHeader id="item-2">
                        <CardTitle className="lead collapse-title collapsed">
                          Parent Access
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
                              onChange={handleParentOnChange}
                              value={
                                portalData?.content?.parentSection?.title
                              }
                              className={`form-control`}
                            />
                          </FormGroup>
                          <FormGroup className="mb-1">
                            <Label for="url">Url</Label>
                            <Field
                              name="url"
                              id="url"
                              onChange={handleParentOnChange}
                              value={
                                portalData?.content?.parentSection?.url
                              }
                              className={`form-control`}
                            />
                          </FormGroup>
                        </CardBody>
                      </UncontrolledCollapse>
                    </Card>
                  </div>
                </div>

                {/******************************Staff Access******************************/}

                <div className="variation-row-wrapper mb-2">
                  <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                    <Card>
                      <CardHeader id="item-3">
                        <CardTitle className="lead collapse-title collapsed">
                          Staff Access
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
                              onChange={handleStaffOnChange}
                              value={
                                portalData?.content?.staffSection?.title
                              }
                              className={`form-control`}
                            />
                          </FormGroup>
                          <FormGroup className="mb-1">
                            <Label for="url">Url</Label>
                            <Field
                              name="url"
                              id="url"
                              onChange={handleStaffOnChange}
                              value={
                                portalData?.content?.staffSection?.url
                              }
                              className={`form-control`}
                            />
                          </FormGroup>
                        </CardBody>
                      </UncontrolledCollapse>
                    </Card>
                  </div>
                </div>

                {/******************************Student Access******************************/}

                <div className="variation-row-wrapper mb-2">
                  <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                    <Card>
                      <CardHeader id="item-4">
                        <CardTitle className="lead collapse-title collapsed">
                          Student Access
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
                              onChange={handleStudentOnChange}
                              value={
                                portalData?.content?.studentSection?.title
                              }
                              className={`form-control`}
                            />
                          </FormGroup>
                          <FormGroup className="mb-1">
                            <Label for="url">Url</Label>
                            <Field
                              name="url"
                              id="url"
                              onChange={handleStudentOnChange}
                              value={
                                portalData?.content?.studentSection?.url
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
      {/* //! **************Contact Section*************** */}
      <Card className="welcome-section">
        <CardHeader>
          <CardTitle>Contact Section</CardTitle>
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
                          Contact Section
                        </CardTitle>
                        {/* <ChevronDown size={15} className="collapse-icon" /> */}
                      </CardHeader>
                      <UncontrolledCollapse toggler="#item-5">
                        <CardBody>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <FormGroup className="mb-1">
                                <Label for="title">Title</Label>
                                <Field
                                  name="title"
                                  id="title"
                                  onChange={handleContactOnChange}
                                  value={
                                    portalData?.content?.contactSection?.title
                                  }
                                  className={`form-control`}
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FormGroup className="mb-1">
                                <Label for="email">Email Address</Label>
                                <Field
                                  name="email"
                                  id="email"
                                  onChange={handleContactOnChange}
                                  value={
                                    portalData?.content?.contactSection?.email
                                  }
                                  className={`form-control`}
                                />
                              </FormGroup>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FormGroup className="mb-1">
                                <Label for="phone">Phone Number</Label>
                                <Field
                                  name="phone"
                                  id="phone"
                                  onChange={handleContactOnChange}
                                  value={
                                    portalData?.content?.contactSection?.phone
                                  }
                                  className={`form-control`}
                                />
                              </FormGroup>
                            </Grid>
                          </Grid>
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
                        value={portalData?.content?.meta_details?.title}
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
                          portalData?.content?.meta_details?.description
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
                          portalData?.content?.meta_details?.schema_markup
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
            <CardTitle>Arabic Content Section</CardTitle>
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
                  {/* //! **************Portal Content Section************** */}
                  <div className="variation-row-wrapper mb-2">
                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                      <Card>
                        <CardHeader id="item-1">
                          <CardTitle className="lead collapse-title collapsed">
                            AGS Portal Content
                          </CardTitle>
                          {/* <ChevronDown size={15} className="collapse-icon" /> */}
                        </CardHeader>
                        <UncontrolledCollapse toggler="#item-1">
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
                                      portalData?.content?.arabic
                                        ?.portalContent?.description
                                    }
                                    onChange={(e) =>
                                      handleArabicPortalEditor(
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
        {/* //! **************Access Section*************** */}
        <Card className="arabic-slider-bottom-section">
          <CardHeader>
            <CardTitle>Access Section</CardTitle>
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
                            Parnet Access
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
                                  portalData?.content?.arabic?.parentSection
                                    ?.title
                                }
                                onChange={handleArabicParentOnChange}
                                className={`form-control`}
                              />
                            </FormGroup>
                          </CardBody>
                        </UncontrolledCollapse>
                      </Card>
                    </div>
                  </div>

                  {/**********************Staff Access ***************/}
                  <div className="variation-row-wrapper mb-2">
                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                      <Card>
                        <CardHeader id="item-3">
                          <CardTitle className="lead collapse-title collapsed">
                            Staff Access
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
                                value={
                                  portalData?.content?.arabic?.staffSection
                                    ?.title
                                }
                                onChange={handleArabicStaffOnChange}
                                className={`form-control`}
                              />
                            </FormGroup>
                          </CardBody>
                        </UncontrolledCollapse>
                      </Card>
                    </div>
                  </div>

                  {/**********************Student Access ***************/}
                  <div className="variation-row-wrapper mb-2">
                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                      <Card>
                        <CardHeader id="item-4">
                          <CardTitle className="lead collapse-title collapsed">
                            Student Access
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
                                value={
                                  portalData?.content?.arabic?.studentSection
                                    ?.title
                                }
                                onChange={handleArabicStudentOnChange}
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
        {/* //! **************Content Section*************** */}
        <Card className="arabic-welcome-section">
          <CardHeader>
            <CardTitle>Contact Section</CardTitle>
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
                            Contact Section
                          </CardTitle>
                          {/* <ChevronDown size={15} className="collapse-icon" /> */}
                        </CardHeader>
                        <UncontrolledCollapse toggler="#item-5">
                          <CardBody>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4}>
                                <FormGroup className="mb-1">
                                  <Label for="title">Title</Label>
                                  <Field
                                    name="title"
                                    id="title"
                                    onChange={handleArabicContactOnChange}
                                    value={
                                      portalData?.content?.arabic
                                        ?.contactSection?.title
                                    }
                                    className={`form-control`}
                                  />
                                </FormGroup>
                              </Grid>
                              <Grid item xs={12} sm={4}>
                                <FormGroup className="mb-1">
                                  <Label for="email">Email Address</Label>
                                  <Field
                                    name="email"
                                    id="email"
                                    onChange={handleArabicContactOnChange}
                                    value={
                                      portalData?.content?.arabic
                                        ?.contactSection?.email
                                    }
                                    className={`form-control`}
                                  />
                                </FormGroup>
                              </Grid>
                              <Grid item xs={12} sm={4}>
                                <FormGroup className="mb-1">
                                  <Label for="phone">Phone Number</Label>
                                  <Field
                                    name="phone"
                                    id="phone"
                                    onChange={handleArabicContactOnChange}
                                    value={
                                      portalData?.content?.arabic
                                        ?.contactSection?.phone
                                    }
                                    className={`form-control`}
                                  />
                                </FormGroup>
                              </Grid>
                            </Grid>
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
                            portalData?.content?.arabic?.meta_details
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
                            portalData?.content?.arabic?.meta_details
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
                            portalData?.content?.arabic?.meta_details
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

export default AgsPortal;
