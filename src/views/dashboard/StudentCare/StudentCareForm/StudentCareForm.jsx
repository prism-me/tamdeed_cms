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
} from "reactstrap";
import { useParams, useHistory } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import "./StudentCareForm.scss";
// import { API } from "../../../../http/API";
import AWS from "aws-sdk";
import CKEditor from "ckeditor4-react";
import { ckEditorConfig } from "../../../../utils/data";
import GalleryModal from "../../gallery-modal/GalleryModal";
import { API } from "../../../../http/API";
import { UpdateTwoTone } from "@material-ui/icons";

const formSchema = Yup.object().shape({
  required: Yup.string().required("Required"),
});

const initialObj = {
  title: "",
  description: "",
  thumbnail: "",
  video_link: "",
  arabic: {
    title: "",
    description: "",
  },
};

const StudentCareForm = (props) => {
  const history = useHistory();
  const { id } = useParams();
  const [feedingAdvisor, setFeedingAdvisor] = useState({ ...initialObj });
  const [isEdit, setIsEdit] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [imagesData, setImagesData] = useState([]);
  const [isSingle, setIsSingle] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [isBanner, setIsBanner] = useState(false);

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

  //!--------Call Article_category Api for Edit----

  useEffect(() => {
    if (id && id !== "") {
      setIsEdit(true);
      API.get(`/studentCare/${id}`)
        .then((response) => {

          if (!response.data.data.arabic) {
            response.data.data.arabic = initialObj.arabic;
          }
          if (response.status === 200 || response.status === 201) {
            setFeedingAdvisor(response.data.data);
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);
  useEffect(
    () => {
      setFeedingAdvisor({
        ...feedingAdvisor,
        route: feedingAdvisor.title.replace(/\s+/g, "-").toLocaleLowerCase(),
      });
    },
    isEdit ? [] : [feedingAdvisor.title]
  );

  const handleImageSelect = (e, index) => {
    if (e.target.checked) {
      if (isSingle && !isBanner) {
        setFeedingAdvisor({
          ...feedingAdvisor,
          thumbnail: imagesData[index].url,
        });
        setThumbnailPreview(imagesData[index].url);
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

  //!-----------Handle Input Fields---------

  const handleFieldChange = (e) => {
    let updatedValues = { ...feedingAdvisor };
    updatedValues[e.target.name] = e.target.value;
    setFeedingAdvisor(updatedValues);
  };
  //! Handle Arbic OnChnage
  const handleArabicOnChange = (e) => {
    // debugger;
    let updatedValue = { ...feedingAdvisor };
    updatedValue.arabic[e.target.name] = e.target.value;
    setFeedingAdvisor(updatedValue);
  };
  //! ***Handle Arabic Editor***
  const handleArabicEditor = (value) => {
    // debugger;
    let updatedValue = { ...feedingAdvisor };
    updatedValue.arabic.description = value;
    setFeedingAdvisor(updatedValue);
  };

  //!------------------Submit and Edit---------------
  const handleSubmit = () => {
    let updatedData = { ...feedingAdvisor };
    // updatedData.arabic.thumbnail = updatedData.thumbnail;
    if (isEdit) {
      let updateId = updatedData._id;
      delete updatedData["_id"];

      API.put(`/studentCare/${updateId}`, updatedData)
        // API.put(`/studentCare/${updatedData}`)
        .then((res) => {
          alert("Item updated successfully");
          history.push("/StudentCare/list");
        })
        .catch((err) => alert("Something went wrong"));
    } else {
      API.post(`/studentCare`, feedingAdvisor)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            alert("Item added successfully");
            history.push("/StudentCare/list");
          }
        })
        .catch((err) => console.log(err));
    }
  };
  // {
  //   console.log("edit", isEdit)
  // }
  return (
    <>
      <Card className="feeding-advisor-form">
        <CardHeader>
          <CardTitle>
            Student Care {isEdit ? "Edit" : ""} Form
          </CardTitle>
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
                <FormGroup className="mb-1">
                  <Label for="title">Title</Label>
                  <Field
                    name="title"
                    id="title"
                    onChange={handleFieldChange}
                    value={feedingAdvisor.title}
                    className={`form-control`}
                  />
                </FormGroup>

                <Row>
                  <Col sm={9}>
                    <div>
                      <Label for="infoText">Description</Label>
                      <CKEditor
                        config={ckEditorConfig}
                        onBeforeLoad={(CKEDITOR) =>
                          (CKEDITOR.disableAutoInline = true)
                        }
                        data={feedingAdvisor.description}
                        onChange={(e) =>
                          setFeedingAdvisor({
                            ...feedingAdvisor,
                            description: e.editor.getData(),
                          })
                        }
                      />
                    </div>
                  </Col>
                  <Col sm={3}>
                    <FormGroup className="">
                      <Label for="thumbnail">Featured Image</Label>
                      <div className="clearfix" />
                      <div className="img-preview-wrapper">
                        {feedingAdvisor.thumbnail !== "" && (
                          <img src={feedingAdvisor.thumbnail} alt="" />
                        )}
                      </div>
                      <Button.Ripple
                        color="primary"
                        className="p-1"
                        onClick={() => {
                          setIsSingle(true);
                          setIsBanner(false);
                          setModalShow(true);
                        }}
                      >
                        Add Featured Image
                      </Button.Ripple>
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup className="mb-1">
                  <Label for="video_link">Video Link</Label>
                  <Field
                    name="video_link"
                    id="video_link"
                    onChange={handleFieldChange}
                    value={feedingAdvisor.video_link}
                    className={`form-control`}
                  />
                </FormGroup>
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
      {/* //!--------Arabic Version---------- */}

      <Card className="feeding-advisor-arabic-form">
        <CardHeader>
          <CardTitle>Arabic Form</CardTitle>
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
                <FormGroup className="mb-1">
                  <Label for="title">Title</Label>
                  <Field
                    name="title"
                    id="title"
                    value={feedingAdvisor?.arabic?.title}
                    onChange={handleArabicOnChange}
                    className={`form-control`}
                  />
                </FormGroup>

                <Row>
                  <Col sm={12}>
                    <div>
                      <Label for="infoText">Description</Label>
                      <CKEditor
                        config={ckEditorConfig}
                        onBeforeLoad={(CKEDITOR) =>
                          (CKEDITOR.disableAutoInline = true)
                        }
                        data={feedingAdvisor?.arabic?.description}
                        onChange={(e) => handleArabicEditor(e.editor.getData())}
                      />
                    </div>
                  </Col>
                </Row>

                <Button.Ripple
                  onClick={handleSubmit}
                  color="primary"
                  type="submit"
                  className="mt-2"
                >
                  {isEdit ? "Edit" : "Add"}
                </Button.Ripple>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </>
  );
};

export default StudentCareForm;
