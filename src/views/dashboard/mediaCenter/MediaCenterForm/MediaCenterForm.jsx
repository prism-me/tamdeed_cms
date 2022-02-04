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
    Input
} from "reactstrap";
import { useParams, useHistory } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import "./MediaCenterForm.scss";
import CKEditor from "ckeditor4-react";
import { ckEditorConfig } from "../../../../utils/data";
import GalleryModal from "../../gallery-modal/GalleryModal";
import { API } from "../../../../http/API";
import { UpdateTwoTone } from "@material-ui/icons";
import Select from "react-select";

const options = [
  { value: "Latest Updates", label: "Latest Updates" },
  { value: "Hosted Events", label: "Hosted Events" },
  { value: "In the News", label: "In the News" }
];


const formSchema = Yup.object().shape({
    required: Yup.string().required("Required"),
});

const initialObj = {
    name :"",
    img: "",
    banner_img: "",
    media_type: "",
    alt_tag: "",
    link: "",
    slug: "",
    short_description: "",
    long_description : ""
};

const MediaCenterForm = (props) => {
    const history = useHistory();
    const { id } = useParams();
    const [media, setMedia] = useState({ ...initialObj });
    const [isEdit, setIsEdit] = useState(false);
    const [modalShow, setModalShow] = React.useState(false);
    const [imagesData, setImagesData] = useState([]);
    const [isSingle, setIsSingle] = useState(false);
    const [isBannerImg, setIsBannerImg] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [selectedType, setSelectedType] = useState(null);
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
            API.get(`/news/${id}`)
                .then((response) => {
                    // debugger;

                    if (response.status === 200 || response.status === 201) {
                        setMedia(response.data.data);
                        let a = {
                          value: response.data.data.media_type, label: response.data.data.media_type
                        }
                        setSelectedType(a);
                        // console.log(mentors);
                    }
                })
                .catch((err) => console.log(err));
        }
    }, []);

    // useEffect(
    //     () => {
    //         // setMedia({
    //         //     ...media,
    //         //     route: media.name.replace(/\s+/g, "-").toLocaleLowerCase(),
    //         // });
    //     },
    //     isEdit ? [] : [media.name]
    // );

    const handleImageSelect = (e, index) => {
        if (e.target.checked) {
            if (isSingle && !isBannerImg && !isBanner) {
                setMedia({
                    ...media,
                    img: imagesData[index].url,
                    alt_tag: imagesData[index].alt_tag
                });
                setThumbnailPreview(imagesData[index].url);
                setTimeout(() => {
                    setModalShow(false);
                }, 500);
            }
            if (isBannerImg && !isSingle && !isBanner) {
                setMedia({
                    ...media,
                    banner_img: imagesData[index].url,
                    alt_tag: imagesData[index].alt_tag
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
        let updatedValues = { ...media };
        updatedValues[e.target.name] = e.target.value;
        setMedia(updatedValues);
    };

    const handleTypeChange = selectedOption => {
      let updatedValues = { ...media };
        updatedValues.media_type = selectedOption.value;
        setSelectedType(selectedOption);
        setMedia(updatedValues);
    };

    //!------------------Submit and Edit---------------
    const handleSubmit = () => {
        let updatedData = { ...media };
        updatedData.slug = updatedData.name.replace(/\s+/g, '-').toLowerCase();
        console.log("===updatedData");
        // let formdata = JSON.parse(JSON.stringify(updatedData))
        // // let formdata = updatedData;
        // delete formdata.selectedOption;
        // delete formdata._id;
        // updatedData.arabic.featured_img = updatedData.featured_img;
        if (isEdit) {
            let updateId = updatedData._id;
            delete updatedData["_id"];
            API.put(`/news/${updateId}`, updatedData)
                .then((response) => {
                    if (response.status === 200 || response.status === 201) {
                        alert("MediaCenter updated successfully");
                        history.push("/MediaCenter/list");
                    }
                })
                .catch((err) => alert("Something went wrong"));
        }
        else {
            API.post(`/news`, updatedData)
                .then((response) => {
                    if (response.status === 200 || response.status === 201) {
                        alert("Mentors added successfully");
                        history.push("/MediaCenter/list");
                    }
                })
                .catch((err) => console.log(err));
        }
    };

    return (
        <>
            <Card className="feeding-advisor-form">
                <CardHeader>
                    <CardTitle>
                        Our Media Center {isEdit ? "Edit" : ""} Form
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
                                        <Label for="name">Title</Label>
                                        <Field
                                            name="name"
                                            id="name"
                                            value={media.name}
                                            onChange={handleFieldChange}
                                            className={`form-control`}
                                        />
                                </FormGroup>

                                <FormGroup className="mb-1">
                                    <Label for="designation">Media type</Label>
                                        <Select
                                          onChange={handleTypeChange}
                                          value={selectedType}
                                          options={options}
                                          name="media_type"
                                          placeholder="Media Type"
                                          isSearchable={options}
                                        />
                                </FormGroup>
                                <FormGroup className="mb-1">
                                        <Label for="name">Short description</Label>
                                        <Field
                                            name="short_description"
                                            id="short_description"
                                            value={media.short_description}
                                            onChange={handleFieldChange}
                                            className={`form-control`}
                                        />
                                </FormGroup>
                                <Row>
                                    <Col sm={6}>
                                        <FormGroup className="mb-1">
                                          <Label for="sub_title">Long Description</Label>
                                          <Input
                                            name="long_description"
                                            id="long_description"
                                            onChange={handleFieldChange}
                                            value={media.long_description}
                                            className={`form-control`}
                                            type="textarea"
                                            rows="10"
                                          />
                                      </FormGroup>
                                      <FormGroup className="mb-1">
                                        <Label for="name">Link</Label>
                                        <Field
                                            name="link"
                                            id="link"
                                            value={media.link}
                                            onChange={handleFieldChange}
                                            className={`form-control`}
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col sm={3}>
                                        <FormGroup className="">
                                            <Label for="img">Featured Image</Label>
                                            <div className="clearfix" />
                                            <div className="img-preview-wrapper">
                                                {media.banner_img !== "" && (
                                                    <img src={media.banner_img} alt="" className="img-fluid" />
                                                )}
                                            </div>
                                            <Button.Ripple
                                                color="primary"
                                                className="p-1"
                                                onClick={() => {
                                                    setIsSingle(false);
                                                    setIsBannerImg(true);
                                                    setIsBanner(false);
                                                    setModalShow(true);
                                                    setModalShow(true);
                                                }}
                                            >
                                                Add Featured Image
                                            </Button.Ripple>
                                        </FormGroup>
                                    </Col>
                                    <Col sm={3}>
                                        <FormGroup className="">
                                            <Label for="img">Image Thumbnail</Label>
                                            <div className="clearfix" />
                                            <div className="img-preview-wrapper">
                                                {media.img !== "" && (
                                                    <img src={media.img} alt="" className="img-fluid" />
                                                )}
                                            </div>
                                            <Button.Ripple
                                                color="primary"
                                                className="p-1"
                                                onClick={() => {
                                                    setIsSingle(true);
                                                    setIsBannerImg(false);
                                                    setIsBanner(false);
                                                    setModalShow(true);
                                                }}
                                            >
                                                Add thumbnail Image
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

            <Card>
                <CardBody>
                    {/* //!----------Submit Button--------------- */}
                    <Button.Ripple
                        onClick={handleSubmit}
                        color="primary"
                        type="submit"
                        className="mt-2"
                    >
                        {isEdit ? "Edit" : "Add"}
                    </Button.Ripple>
                </CardBody>
            </Card>
        </>
    );
};

export default MediaCenterForm;
