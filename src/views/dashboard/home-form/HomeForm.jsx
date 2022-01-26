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
  section_id:0,
  slug: "home-page",
  content: {
    banner: [
      {
      title: "",
      subtitle: "",
      image: "",
    },
    {
      title: "",
      subtitle: "",
      image: "",
    },
    {
      title: "",
      subtitle: "",
      image: "",
    }
    ],
    meta_details: {
      title: "",
      description: "",
      schema_markup: "",
    },
    portfolio : [
      {
        image: "",
        title: "",
        subtitle:""
      },
      {
        image: "",
        title: "",
        subtitle:""
      },
      {
        image: "",
        title: "",
        subtitle:""
      },
      {
        image: "",
        title: "",
        subtitle:""
      },
      {
        image: "",
        title: "",
        subtitle:""
      }
    ]
  },
};

const HomeForm = () => {
  const [homeData, setHomeData] = useState({ ...initialObj });
  const [pageData, setPageData] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [imagesData, setImagesData] = useState([]);
  const [isSingle, setIsSingle] = useState(false);
  const [isBanner, setIsBanner] = useState(false);
  const [isPortfolio, setIsPortfolio] = useState(false);
  const [sectionID, setSectionID] = useState(0);


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

      if(isBanner.value && !isPortfolio.value){
        let updatedImage = { ...homeData };
            updatedImage.content.banner[isBanner.index - 1].image = imagesData[index].url;
            setHomeData(updatedImage);

            setTimeout(() => {
                setModalShow(false);
            }, 500);
      }

      if(!isBanner.value && isPortfolio.value){
        let updatedImage = { ...homeData };
            updatedImage.content.portfolio[isPortfolio.index - 1].image = imagesData[index].url;
            setHomeData(updatedImage);

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
          let currentPage = response.data.data.find((x) => x.slug === "home-page");
          setPageData(currentPage);
          API.get(`/all_sections/${currentPage._id}`)
            .then((res) => {

              if (res.data.data.length < 1) {
                setHomeData({ ...initialObj });
                console.log("===homeData if")
                console.log(homeData)
              } else {
                let content = res.data.data[0]?.content;
                setSectionID(res.data.data[0]._id);
                setHomeData({ ...initialObj, content });
                console.log("===homeData")
                console.log(homeData)
              }

            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  //!*********** Handle Banner************
  //! __________Handle OnChange__________
  const handleBannerOnChange = (e, index) => {
    let updatedValue = { ...homeData };
    updatedValue.content.banner[index][e.target.name] = e.target.value;
    setHomeData(updatedValue);
  };
  //!*********** Handle Portfolio************
  //! __________Handle OnChange__________
  const handlePortfolioOnChange = (e, index) => {
    let updatedValue = { ...homeData };
    updatedValue.content.portfolio[index][e.target.name] = e.target.value;
    setHomeData(updatedValue);
  };


  //! --------------Handle Submit-------------
  const handleSubmit = () => {

    let updatedData = { ...homeData, page_id: pageData._id };

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
                        {homeData?.content?.banner?.map((x, index) => (
                          <Row>
                            <Col sm={9}>
                              <FormGroup className="mb-1">
                              <Label for="title">Title</Label>
                              <Field
                                name="title"
                                id="title"
                                onChange={(e) => handleBannerOnChange(e, index)}
                                value={x.title}
                                className={`form-control`}
                              />
                              </FormGroup>
                              <FormGroup className="mb-1">
                                <Label for="title">SubTitle</Label>
                                <Field
                                  name="subtitle"
                                  id="subtitle"
                                  onChange={(e) => handleBannerOnChange(e, index)}
                                  value={x.subtitle}
                                  className={`form-control`}
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
                                        src={
                                          x.image
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
                                    setModalShow(true);
                                    setIsBanner({value : true, index : index + 1});
                                    setIsPortfolio({value : false, index : 0});
                                  }}
                                >
                                  Banner Image
                                </Button.Ripple>
                              </FormGroup>
                            </Col>
                          </Row>
                        ))}
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
          <CardTitle>Portfolio Section</CardTitle>
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
                          Portfolio
                        </CardTitle>
                        {/* <ChevronDown size={15} className="collapse-icon" /> */}
                      </CardHeader>
                      <UncontrolledCollapse toggler="#item-2">
                        <CardBody>
                        {homeData?.content?.portfolio?.map((x, index) => (
                          <Row>
                            <Col sm={9}>
                              <FormGroup className="mb-1">
                              <Label for="title">Title</Label>
                              <Field
                                name="title"
                                id="title"
                                onChange={(e) => handlePortfolioOnChange(e, index)}
                                value={x.title}
                                className={`form-control`}
                              />
                              </FormGroup>
                              <FormGroup className="mb-1">
                                <Label for="title">SubTitle</Label>
                                <Field
                                  name="subtitle"
                                  id="subtitle"
                                  onChange={(e) => handlePortfolioOnChange(e, index)}
                                  value={x.subtitle}
                                  className={`form-control`}
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
                                        src={
                                          x.image
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
                                    setModalShow(true);
                                    setIsBanner({value : false, index : 0});
                                    setIsPortfolio({value : true, index : index + 1});
                                  }}
                                >
                                  Banner Image
                                </Button.Ripple>
                              </FormGroup>
                            </Col>
                          </Row>
                        ))}
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
      <div className="submit-btn-wrap">
          <Button.Ripple onClick={handleSubmit} color="primary" type="submit">
              Submit
          </Button.Ripple>
      </div>

      {/* //! **************SEO Section*************** */}
      {/* <Card className="welcome-section">
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
      </Card> */}

    </>
  );
};

export default HomeForm;
