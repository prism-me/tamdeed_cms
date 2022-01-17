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
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import "./PigeonLogo.scss";
import AWS from "aws-sdk";
import CKEditor from "ckeditor4-react";
import GalleryModal from "../../gallery-modal/GalleryModal";
import { API } from "../../../../http/API";

const formSchema = Yup.object().shape({
  required: Yup.string().required("Required"),
});

const initialObj = {
  widget_name: "pigeon-logo",
  page_id: 0,
  widget_type: "pigeon-logo",
  widget_content: {
    title: "",
    content: "",
    logo: "",
    meta_details: {
      title: "",
      description: "",
      schema_markup: "",
    },
    arabic: {
      title: "",
      content: "",
      meta_details: {
        title: "",
        description: "",
        schema_markup: "",
      },
    },
  },
};

const PigeonLogo = () => {
  const [pigeonLogo, setPigeonLogo] = useState({ ...initialObj });
  const [pageData, setPageData] = useState();
  const [modalShow, setModalShow] = React.useState(false);
  const [imagesData, setImagesData] = useState([]);
  const [isSingle, setIsSingle] = useState(false);

  //!------------Gallery--------
  AWS.config.region = "eu-central-1"; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "eu-central-1:8db4219e-3012-4027-ac2e-60ec65e9ca84",
  });

  useEffect(() => {
    viewAlbum("album1");
  }, []);

  //!------------Pages Api Call------------
  useEffect(() => {
    API.get(`/pages`)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          let currentPage = response.data.find((x) => x.slug === "pigeon-logo");

          setPageData(currentPage);

          API.get(`/all_widgets/${currentPage._id}`)
            .then((res) => {
              if (
                !res.data?.widget_content &&
                !res.data[res.data.length - 1].widget_content
              ) {
                res.data.widget_content = initialObj.widget_content;
              }
              if (
                !res.data[res.data.length - 1].widget_content.meta_details
                  .schema_markup
              ) {
                res.data[
                  res.data.length - 1
                ].widget_content.meta_details.schema_markup =
                  initialObj.widget_content.meta_details.schema_markup;
              }
              if (
                !res.data[res.data.length - 1].widget_content.arabic
                  .meta_details.schema_markup
              ) {
                res.data[
                  res.data.length - 1
                ].widget_content.arabic.meta_details.schema_markup =
                  initialObj.widget_content.arabic.meta_details.schema_markup;
              }

              let widget_content =
                res.data?.[res.data.length - 1].widget_content;

              setPigeonLogo({ ...initialObj, widget_content });
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  var albumBucketName = "pigeon-gallery";
  var s3 = new AWS.S3({
    apiVersion: "2011-12-05",
    params: { Bucket: albumBucketName },
  });

  function viewAlbum(albumName) {
    var albumPhotosKey = encodeURIComponent(albumName) + "/";
    let imagesHTMLList = s3.listObjects(
      { Prefix: albumPhotosKey },
      function (err, data) {
        if (err) {
          return alert("There was an error viewing your album: " + err.message);
        }
        // 'this' references the AWS.Request instance that represents the response
        var href = this.request.httpRequest.endpoint.href;
        var bucketUrl = href + albumBucketName + "/";

        var photos = data.Contents.map(function (photo) {
          var photoKey = photo.Key;
          var date = photo.LastModified;
          var photoUrl = bucketUrl + encodeURIComponent(photoKey);
          return {
            image: photoUrl,
            date,
            imageKey: photoKey?.split("album1/")?.[1]?.split(".")?.[0],
          };
        });

        setImagesData(
          photos
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .map((x) => ({ ...x, avatar: x.image, isChecked: false }))
        );
      }
    );
  }
  //!-------handleSelect s3 Images-----------
  const handleImageSelect = (e, index) => {
    if (e.target.checked) {
      if (isSingle) {
        let updatedImage = { ...pigeonLogo };
        updatedImage.widget_content.logo = imagesData[index].avatar;
        setPigeonLogo(updatedImage);

        // setThumbnailPreview(imagesData.avatar);
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

  //*************Hanle onChange Field**********
  const handleOnChange = (e) => {
    let updatedValue = { ...pigeonLogo };
    let update = updatedValue.widget_content;
    update[e.target.name] = e.target.value;
    updatedValue.widget_content = update;
    setPigeonLogo(updatedValue);
  };
  //*************Hanle onChange Editor**********
  const handleEditor = (value) => {
    let updatedValue = { ...pigeonLogo };
    let update = updatedValue.widget_content;
    update.content = value;
    updatedValue.widget_content = update;
    setPigeonLogo(updatedValue);
  };
  //!______Handle Meta OnChange______
  const handleMetaOnChange = (e) => {
    let updatedValue = { ...pigeonLogo };
    updatedValue.widget_content.meta_details[e.target.name] = e.target.value;
    setPigeonLogo(updatedValue);
  };
  //! *********************************************
  // ***********Handle Arabic Functions***********
  //! *********************************************
  //? ___________Hanle onChange Field__________
  const handleArabicOnChange = (e) => {
    let updatedValue = { ...pigeonLogo };
    let update = updatedValue.widget_content.arabic;
    update[e.target.name] = e.target.value;
    updatedValue.widget_content.arabic = update;
    setPigeonLogo(updatedValue);
  };
  //? _________Hanle onChange Editor_________
  const handleArabicEditor = (value) => {
    let updatedValue = { ...pigeonLogo };
    let update = updatedValue.widget_content.arabic;
    update.content = value;
    updatedValue.widget_content.arabic = update;
    setPigeonLogo(updatedValue);
  };
  //______Handle Arabic OnChange_______
  const handleArabicMetaOnChange = (e) => {
    let updatedValue = { ...pigeonLogo };
    updatedValue.widget_content.arabic.meta_details[e.target.name] =
      e.target.value;
    setPigeonLogo(updatedValue);
  };

  //! ********Handle Submit********
  const handleSubmit = () => {
    const updatedData = { ...pigeonLogo, page_id: pageData._id };
    // debugger;
    API.post(`/widgets`, updatedData)
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
    <div>
      <Card className="pigeon-logo-form">
        <CardHeader>
          <CardTitle>Pigeon Logo Form</CardTitle>
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
                {/* //! **************English Section*************** */}
                <div className="variation-row-wrapper mb-2">
                  <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                    <Card>
                      <CardHeader id="item-1">
                        <CardTitle className="lead collapse-title collapsed">
                          English Version
                        </CardTitle>
                      </CardHeader>
                      <UncontrolledCollapse toggler="#item-1">
                        <CardBody>
                          <FormGroup className="mb-1">
                            <Label for="title">Title</Label>
                            <Field
                              name="title"
                              id="title"
                              onChange={handleOnChange}
                              value={pigeonLogo?.widget_content?.title}
                              className={`form-control`}
                            />
                          </FormGroup>
                          <Row>
                            <Col sm={9}>
                              <div>
                                <Label for="content">Content</Label>
                                <CKEditor
                                  onBeforeLoad={(CKEDITOR) =>
                                    (CKEDITOR.disableAutoInline = true)
                                  }
                                  data={pigeonLogo?.widget_content?.content}
                                  onChange={(e) =>
                                    handleEditor(e.editor.getData())
                                  }
                                />
                              </div>
                            </Col>
                            <Col sm={3}>
                              <FormGroup className="">
                                <Label for="featured_img">Pigeon Logo</Label>
                                <div className="clearfix" />
                                <div className="img-preview-wrapper">
                                  {pigeonLogo?.widget_content?.logo !== "" && (
                                    <img
                                      src={pigeonLogo?.widget_content?.logo}
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
                                  Add Pigeon Logo
                                </Button.Ripple>
                              </FormGroup>
                            </Col>
                          </Row>
                        </CardBody>
                      </UncontrolledCollapse>
                    </Card>
                  </div>
                </div>
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
                        value={pigeonLogo?.widget_content?.meta_details?.title}
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
                          pigeonLogo?.widget_content?.meta_details?.description
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
                          pigeonLogo?.widget_content?.meta_details
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
        <GalleryModal
          open={modalShow}
          handleClose={() => setModalShow(false)}
          handleImageSelect={handleImageSelect}
          data={imagesData}
          refreshData={() => viewAlbum("album1")}
        />
      </Card>
      {/* //! **************************************
      //? ***************Arabic Version*************
      //! **************************************** */}

      <Card className="arabic-pigeon-logo-form">
        <CardHeader>
          <CardTitle>Arabic Pigeon Logo Form</CardTitle>
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
                {/* //! **************Arabic Section*************** */}
                <div className="variation-row-wrapper mb-2">
                  <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                    <Card>
                      <CardHeader id="item-2">
                        <CardTitle className="lead collapse-title collapsed">
                          Arabic Version
                        </CardTitle>
                      </CardHeader>
                      <UncontrolledCollapse toggler="#item-2">
                        <CardBody>
                          <FormGroup className="mb-1">
                            <Label for="title">Title</Label>
                            <Field
                              name="title"
                              id="title"
                              onChange={handleArabicOnChange}
                              value={pigeonLogo?.widget_content?.arabic?.title}
                              className={`form-control`}
                            />
                          </FormGroup>
                          <Row>
                            <Col sm={12}>
                              <div>
                                <Label for="content">Content</Label>
                                <CKEditor
                                  onBeforeLoad={(CKEDITOR) =>
                                    (CKEDITOR.disableAutoInline = true)
                                  }
                                  data={
                                    pigeonLogo?.widget_content?.arabic?.content
                                  }
                                  onChange={(e) =>
                                    handleArabicEditor(e.editor.getData())
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
                          pigeonLogo?.widget_content?.arabic?.meta_details
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
                          pigeonLogo?.widget_content?.arabic?.meta_details
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
                          pigeonLogo?.widget_content?.arabic?.meta_details
                            ?.schema_markup
                        }
                      />
                    </div>
                  </CardBody>
                </Card>

                <div className="submit-btn-wrap">
                  <Button.Ripple
                    onClick={handleSubmit}
                    color="primary"
                    type="submit"
                  >
                    Submit
                  </Button.Ripple>
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
          refreshData={() => viewAlbum("album1")}
        />
      </Card>
    </div>
  );
};

export default PigeonLogo;
