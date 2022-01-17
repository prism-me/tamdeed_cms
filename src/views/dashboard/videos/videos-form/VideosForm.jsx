import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Button,
  Label,
  Input,
  Row,
  Col
} from "reactstrap";
import { useHistory, useParams } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import "./VideosForm.scss";
import { API } from "../../../../http/API";
import { withRouter } from "react-router-dom";
import AWS from "aws-sdk";
import GalleryModal from "../../gallery-modal/GalleryModal";

const formSchema = Yup.object().shape({
  required: Yup.string().required("Required"),
});

const initialObj = {
  title: "",
  description: "content",
  thumbnail: "",
  video_link: "",
  type: "experience-with-ags",
  arabic: {
    title: "",
    // description: "",
  },
};

const VideoForm = (props) => {
  const history = useHistory();
  const { id } = useParams();
  const [isEdit, setIsEdit] = useState(false);
  const [videoData, setVideoData] = useState({ ...initialObj });
  const [imagesData, setImagesData] = useState([]);
  const [isSingle, setIsSingle] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  // const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [isBanner, setIsBanner] = useState(false);


  //!-----------Call Api for Edit--------------
  useEffect(() => {
    if (id && id !== "") {
      setIsEdit(true);
      API.get(`/exp_and_life/${id}`)
        .then((response) => {
          debugger;
          if (response.status === 200 || response.status === 201) {
            setVideoData(response.data.data[0]);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [id]);

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

  //!--------

  const handleImageSelect = (e, index) => {
    if (e.target.checked) {
      if (isSingle && !isBanner) {
        setVideoData({
          ...videoData,
          thumbnail: imagesData[index].url,
        });
        // setThumbnailPreview(imagesData[index].avatar);
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

  //!------------Handle Input Fields-------
  const handleFieldChange = (e) => {
    let updatedVideo = { ...videoData };
    updatedVideo[e.target.name] = e.target.value;
    setVideoData(updatedVideo);
  };

  //!------------Handle Arabic Fields-------
  const handleArabicFieldChange = (e) => {
    let updatedVideo = { ...videoData };
    updatedVideo.arabic[e.target.name] = e.target.value;
    setVideoData(updatedVideo);
  };

  //!------------------Submit and Edit---------------
  const handleSubmit = () => {
    if (isEdit) {
      let updateId = videoData._id;
      delete videoData["_id"];
      API.put(`/update_exp/${updateId}`, videoData)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            alert("Item updated successfully");
            history.push("/experienceAgs/list");
          }
        })
        .catch((err) => alert("Something went wrong"));
    } else {
      API.post(`/exp_and_life`, videoData)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            alert("Item added successfully");
            // console.log(response.data);
            history.push("/experienceAgs/list");
          }
        })
        .catch((err) => alert("Something went wrong"));
    }
  };

  return (
    <>
      <Card className="category-add-form">
        <CardHeader>
          <CardTitle>Experience Ags Difference {isEdit ? "Edit" : "Add"} Form</CardTitle>
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
                    value={videoData.title}
                    className={`form-control`}
                  />
                </FormGroup>
                <FormGroup className="mb-1">
                  <Label for="video_link">Video Link</Label>
                  <Field
                    name="video_link"
                    id="video_link"
                    onChange={handleFieldChange}
                    value={videoData.video_link}
                    className={`form-control`}
                  />
                </FormGroup>
                <Row>
                  <Col sm={3}>
                    <FormGroup className="mb-1">
                      <Label for="thumbnail">Featured Image</Label>
                      <div className="clearfix" />
                      <div className="img-preview-wrapper">
                        {videoData.thumbnail !== "" && (
                          <img src={videoData.thumbnail} alt="" />
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

      {/* *********************
      ARABIC VERSION FIELDS
      ********************* */}
      {isEdit && (
        // <Card style={{ background: '#f0f0f0', boxShadow: `0px 4px 25px 0px rgba(230, 85, 80, 0.4)` }}>
        <Card style={{ background: "rgba(230,85,80,.15)" }}>
          <CardBody>
            <div className="arabic-form">
              <h3>Arabic Fields</h3>
              <Formik
                initialValues={{
                  required: "",
                  email: "",
                  video_link: "",
                  number: "",
                  date: "",
                  minlength: "",
                  maxlength: "",
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
                        onChange={handleArabicFieldChange}
                        value={videoData.arabic?.title}
                        className={`form-control`}
                      />
                    </FormGroup>
                  </Form>
                )}
              </Formik>
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardBody>
          {/* //!----------Submit Button--------------- */}
          <Button.Ripple
            onClick={handleSubmit}
            color="primary"
            type="submit"
            className="mt-2"
          >
            {isEdit ? "Update" : "Add"}
          </Button.Ripple>
        </CardBody>
      </Card>
    </>
  );
};

export default withRouter(VideoForm);
