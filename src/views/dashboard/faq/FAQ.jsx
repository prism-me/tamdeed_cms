import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { DeleteOutlined } from "@material-ui/icons";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  Label,
  Col,
  Row,
  UncontrolledCollapse,
  FormGroup,
  Input,
} from "reactstrap";
import CKEditor from "ckeditor4-react";
import { ckEditorConfig } from "../../../utils/data";
import "./FAQ.scss";
import { API } from "../../../http/API";

const formSchema = Yup.object().shape({});

const initialObj = {
  name: "faq-page",
  page_id: 5,
  slug: "faq-page",
  content: {
    meta_details: {
      title: "",
      description: "",
      schema_markup: "",
    },
    faq: [
      {
        questions: "",
        answers: "",
      },
    ],
    arabic: {
      meta_details: {
        title: "",
        description: "",
        schema_markup: "",
      },
      faq: [
        {
          questions: "",
          answers: "",
        },
      ],
    },
  },
};

const FAQ = () => {
  const [faqData, setFaqData] = useState({ ...initialObj });
  const [pageData, setPageData] = useState();

  //!------Pages Api Call---------
  useEffect(() => {
    API.get(`/pages`)
      .then((response) => {
        // debugger;
        if (response.status === 200 || response.status === 201) {
          let currentPage = response.data.data.find((x) => x.slug === "faq-page");
          setPageData(currentPage);
          API.get(`/all_sections/${currentPage._id}`)
            .then((res) => {
              if (!res.data.data[res.data.data.length - 1].content) {
                res.data.data[res.data.data.length - 1].content =
                  initialObj.content;
              }
              if (!res.data.data[res.data.data.length - 1]?.content.arabic) {
                res.data.data[res.data.data.length - 1].content.arabic =
                  initialObj.content.arabic;
              }
              if (!res.data.data[res.data.data.length - 1].content.meta_details) {
                res.data.data[res.data.data.length - 1].content.meta_details =
                  initialObj.content.meta_details;
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
                  .meta_details
              ) {
                res.data.data[
                  res.data.data.length - 1
                ].content.arabic.meta_details =
                  initialObj.content.arabic.meta_details;
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
              let content =
                res.data.data?.[res.data.data.length - 1]?.content;
              setFaqData({ ...initialObj, content });
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }, []);
  // console.log("FAQ state response", faqData.content);

  //!-------handle onChange-------
  const handleOnChange = (e, index) => {
    let updatedValue = { ...faqData };
    let update = updatedValue.content.faq;
    update[index][e.target.name] = e.target.value;
    updatedValue.content.faq = update;
    setFaqData(updatedValue);
  };
  //!-------Handle OnChnage Ck Editor
  const handleEditor = (index, value, property) => {
    let updatedValue = { ...faqData };
    let updatedData = updatedValue.content.faq;
    updatedData[index][property] = value;
    updatedValue.content.faq = updatedData;
    setFaqData(updatedValue);
  };

  //!________Handle Meta_Details onChange________
  const handleMetaOnChange = (e) => {
    let updatedData = { ...faqData };
    updatedData.content.meta_details[e.target.name] = e.target.value;
    setFaqData(updatedData);
  };
  //!----------ADD new Faq------
  const addVariation = () => {
    let updatedValue = { ...faqData };
    updatedValue.content.faq.push({
      questions: "",
      answers: "",
    });
    setFaqData(updatedValue);
  };

  //!Remove Faq------
  const removeVariation = (index) => {
    let updatedValue = { ...faqData };
    let updatedFaq = updatedValue.content.faq.filter(
      (x, i) => i !== index
    );
    updatedValue.content.faq = updatedFaq;
    setFaqData(updatedValue);
  };

  //! *********************************
  //? *** Arabic Version Functions ***
  //! *********************************

  //-------Handle Arabic onChange-------
  const handleArabicOnChange = (e, index) => {
    let updatedValue = { ...faqData };
    let update = updatedValue.content.arabic.faq;
    update[index][e.target.name] = e.target.value;
    updatedValue.content.arabic.faq = update;
    setFaqData(updatedValue);
  };

  //-------Handle OnChnage Ck Editor
  const handleArabicEditor = (index, value, property) => {
    let updatedValue = { ...faqData };
    let updatedData = updatedValue.content.arabic.faq;
    updatedData[index][property] = value;
    updatedValue.content.arabic.faq = updatedData;
    setFaqData(updatedValue);
  };
  //________Handle Arbic Meta_Details onChange________
  const handleArabicMetaOnChange = (e) => {
    let updatedData = { ...faqData };
    updatedData.content.arabic.meta_details[e.target.name] =
      e.target.value;
    setFaqData(updatedData);
  };
  //----------ADD new Faq------
  const addArabicFaq = () => {
    let updatedValue = { ...faqData };
    updatedValue.content.arabic.faq.push({
      questions: "",
      answers: "",
    });
    setFaqData(updatedValue);
  };

  //----------Remove Faq------
  const removeArabicFaq = (index) => {
    let updatedValue = { ...faqData };
    let updatedFaq = updatedValue.content.arabic.faq.filter(
      (x, i) => i !== index
    );
    updatedValue.content.arabic.faq = updatedFaq;
    setFaqData(updatedValue);
  };
  //! **************************************
  //? ********End Arabic Fuctions********
  //! **************************************

  //!Handle submit------
  const handleSubmit = () => {
    let updatedData = { ...faqData, page_id: pageData._id };
    API.post(`/sections`, updatedData)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          alert("FAQ submitted successfully");
          window.location.reload();
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Card className="faq-form-wrap">
        <CardHeader>
          <CardTitle> FAQ Form</CardTitle>
        </CardHeader>
        <CardBody>
          <Formik initialValues={{}} validationSchema={formSchema}>
            {({ errors, touched }) => (
              <Form>
                <div className="mb-2">
                  <div className="clearfix mb-1" />
                  {faqData?.content?.faq?.map((x, index) => (
                    <div className="variation-row-wrapper mb-2" key={index}>
                      <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                        <Card>
                          <CardHeader
                            id={`item-${index}`}
                            className="accordion-header"
                          >
                            <CardTitle className="lead collapse-title collapsed">
                              Question # {index + 1}
                            </CardTitle>
                          </CardHeader>
                          <UncontrolledCollapse toggler={`item-${index}`}>
                            <CardBody>
                              <Row>
                                <Col sm={12}>
                                  <Label for="questions">Question</Label>
                                  <Field
                                    name="questions"
                                    id={`variation_name_${index}`}
                                    onChange={(e) => handleOnChange(e, index)}
                                    value={x.questions}
                                    placeholder={"Question"}
                                    className={`form-control`}
                                  />
                                  <div>
                                    <Label for="short_description">
                                      Answer
                                    </Label>
                                    <CKEditor
                                      config={ckEditorConfig}
                                      onBeforeLoad={(CKEDITOR) =>
                                        (CKEDITOR.disableAutoInline = true)
                                      }
                                      data={x.answers}
                                      onChange={(e) => {
                                        handleEditor(
                                          index,
                                          e.editor.getData(),
                                          "answers"
                                        );
                                      }}
                                    />
                                  </div>
                                </Col>

                                <Col sm={12}>
                                  <div
                                    style={{
                                      height: "100%",
                                      cursor: "pointer",
                                    }}
                                    className="d-flex align-items-center justify-content-end"
                                  >
                                    <DeleteOutlined
                                      color="secondary"
                                      onClick={() => removeVariation(index)}
                                    />
                                  </div>
                                </Col>
                              </Row>
                            </CardBody>
                          </UncontrolledCollapse>
                        </Card>
                      </div>
                    </div>
                  ))}
                  {/* <div className="submit-btn-wrap">
                    <Button.Ripple
                      color="primary"
                      type="button"
                      onClick={handleSubmit}
                      className="submit-btn"
                    >
                      Submit
                    </Button.Ripple>
                  </div> */}
                </div>

                <Button.Ripple
                  onClick={addVariation}
                  color="danger"
                  type="button"
                  className="mt-0"
                  size="sm"
                >
                  Add New Question
                </Button.Ripple>
                <Card className="mt-3">
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
                        value={faqData?.content?.meta_details?.title}
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
                          faqData?.content?.meta_details?.description
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
                        onChange={handleMetaOnChange}
                        value={
                          faqData?.content?.meta_details?.schema_markup
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
      {/* //! *********************************************************
      //? ***********************Arabic Version************************
      //! ********************************************************* */}
      <Card className="arabic-faq-form-wrap">
        <CardHeader>
          <CardTitle> Arabic FAQ Form</CardTitle>
        </CardHeader>
        <CardBody>
          <Formik initialValues={{}} validationSchema={formSchema}>
            {({ errors, touched }) => (
              <Form>
                <div className="mb-2">
                  <div className="clearfix mb-1" />
                  {faqData?.content?.arabic?.faq?.map((x, index) => (
                    <div className="variation-row-wrapper mb-2" key={index}>
                      <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                        <Card>
                          <CardHeader
                            id={`item-${index}`}
                            className="accordion-header"
                          >
                            <CardTitle className="lead collapse-title collapsed">
                              Question # {index + 1}
                            </CardTitle>
                          </CardHeader>
                          <UncontrolledCollapse toggler={`item-${index}`}>
                            <CardBody>
                              <Row>
                                <Col sm={12}>
                                  <Label for="questions">Question</Label>
                                  <Field
                                    name="questions"
                                    id={`variation_name_${index}`}
                                    onChange={(e) =>
                                      handleArabicOnChange(e, index)
                                    }
                                    value={x.questions}
                                    placeholder={"Question"}
                                    className={`form-control`}
                                  />
                                  <div>
                                    <Label for="short_description">
                                      Answer
                                    </Label>
                                    <CKEditor
                                      config={ckEditorConfig}
                                      onBeforeLoad={(CKEDITOR) =>
                                        (CKEDITOR.disableAutoInline = true)
                                      }
                                      data={x.answers}
                                      onChange={(e) => {
                                        handleArabicEditor(
                                          index,
                                          e.editor.getData(),
                                          "answers"
                                        );
                                      }}
                                    />
                                  </div>
                                </Col>

                                <Col sm={12}>
                                  <div
                                    style={{
                                      height: "100%",
                                      cursor: "pointer",
                                    }}
                                    className="d-flex align-items-center justify-content-end"
                                  >
                                    <DeleteOutlined
                                      color="secondary"
                                      onClick={() => removeArabicFaq(index)}
                                    />
                                  </div>
                                </Col>
                              </Row>
                            </CardBody>
                          </UncontrolledCollapse>
                        </Card>
                      </div>
                    </div>
                  ))}
                  <div className="submit-btn-wrap">
                    <Button.Ripple
                      color="primary"
                      type="button"
                      onClick={handleSubmit}
                      className="submit-btn"
                    >
                      Submit
                    </Button.Ripple>
                  </div>
                </div>

                <Button.Ripple
                  onClick={addArabicFaq}
                  color="danger"
                  type="button"
                  className="mt-0"
                  size="sm"
                >
                  Add New Question
                </Button.Ripple>
                <Card className="mt-3">
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
                          faqData?.content?.arabic?.meta_details?.title
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
                          faqData?.content?.arabic?.meta_details
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
                          faqData?.content?.arabic?.meta_details
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
    </>
  );
};

export default FAQ;
