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
import "./SolutionAndServicesForm.scss"
import CKEditor from "ckeditor4-react";
import { ckEditorConfig } from "../../../../utils/data";
import GalleryModal from "../../gallery-modal/GalleryModal";
import { API } from "../../../../http/API";
import { UpdateTwoTone } from "@material-ui/icons";
import Select from "react-select";

const options = [
  { value: "solutions", label: "solutions" },
  { value: "services", label: "services" },
];


const formSchema = Yup.object().shape({
    required: Yup.string().required("Required"),
});

const initialObj = {
    title: "",
    sub_title: "",
    description: "",
    avatar: "",
    type: "",
    alt_tag: ""
};

const SolutionAndServicesForm = (props) => {
    const history = useHistory();
    const { id } = useParams();
    const [solutionAndServices, setsolutionAndServices] = useState({ ...initialObj });
    const [selectedType, setSelectedType] = useState(null);
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
            API.get(`/solutions/${id}`)
                .then((response) => {
                    // debugger;
                    if (!response.data.data.arabic) {
                        response.data.data.arabic = initialObj.arabic;
                    }
                    if (response.status === 200 || response.status === 201) {
                        setsolutionAndServices(response.data.data);
                        let a = {
                          value: response.data.data.type, label: response.data.data.type
                        }
                        setSelectedType(a);
                        // console.log(Solution Or Service);
                    }
                })
                .catch((err) => console.log(err));
        }
    }, []);

    const handleImageSelect = (e, index) => {
        if (e.target.checked) {
            if (isSingle && !isBanner) {
                setsolutionAndServices({
                    ...solutionAndServices,
                    avatar: imagesData[index].url,
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
        let updatedValues = { ...solutionAndServices };
        updatedValues[e.target.name] = e.target.value;
        setsolutionAndServices(updatedValues);
    };

    const handleTypeChange = selectedOption => {
      let updatedValues = { ...solutionAndServices };
        // console.log(updatedValues.designation.value)
        updatedValues.type = selectedOption.value;
        setSelectedType(selectedOption);
        setsolutionAndServices(updatedValues);
    };

    //!------------------Submit and Edit---------------
    const handleSubmit = () => {
        let updatedData = { ...solutionAndServices };
        // updatedData.arabic.featured_img = updatedData.featured_img;
        if (isEdit) {
            let updateId = updatedData._id;
            delete updatedData["_id"];
            API.put(`/solutions/${updateId}`, updatedData)
                .then((response) => {
                    if (response.status === 200 || response.status === 201) {
                        alert("Solution Or Service updated successfully");
                        history.push("/SolutionAndServices/list");
                    }
                })
                .catch((err) => alert("Something went wrong"));
        }
        else {
            API.post(`/solutions`, solutionAndServices)
                .then((response) => {
                    if (response.status === 200 || response.status === 201) {
                        alert("Solution Or Service added successfully");
                        history.push("/SolutionAndServices/list");
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
                    Solution And Services {isEdit ? "Edit" : ""} Form
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
                                        value={solutionAndServices.title}
                                        className={`form-control`}
                                    />
                                </FormGroup>
                                <FormGroup className="mb-1">
                                    <Label for="sub_title">Sub-Title</Label>
                                    <Field
                                        name="sub_title"
                                        id="sub_title"
                                        onChange={handleFieldChange}
                                        value={solutionAndServices.sub_title}
                                        className={`form-control`}
                                    />
                                </FormGroup>
                                <Row>
                                    <Col sm={9}>
                                        {/* <div>
                                            <Label for="infoText">Description</Label>
                                            <CKEditor
                                                config={ckEditorConfig}
                                                onBeforeLoad={(CKEDITOR) =>
                                                    (CKEDITOR.disableAutoInline = true)
                                                }
                                                data={solutionAndServices.description}
                                                onChange={(e) =>
                                                    setsolutionAndServices({
                                                        ...solutionAndServices,
                                                        description: e.editor.getData(),
                                                    })
                                                }
                                            />
                                        </div> */}

                                        <FormGroup className="mb-1">
                                          <Label for="sub_title">Description</Label>
                                          <Input
                                            name="description"
                                            id="description"
                                            onChange={handleFieldChange}
                                            value={solutionAndServices.description}
                                            className={`form-control`}
                                            type="textarea"
                                            rows="6"
                                          />
                                      </FormGroup>
                                      <FormGroup className="mb-1">
                                          <Label for="type">Type</Label>
                                              <Select
                                                value={selectedType}
                                                onChange={handleTypeChange}
                                                options={options}
                                                name="type"
                                                placeholder="Type"
                                                isSearchable={options}
                                              />
                                      </FormGroup>


                                    </Col>
                                    <Col sm={3}>
                                        <FormGroup className="">
                                            <Label for="avatar">Featured Image</Label>
                                            <div className="clearfix" />
                                            <div className="img-preview-wrapper">
                                                {solutionAndServices.avatar !== "" && (
                                                    <img src={solutionAndServices.avatar} alt="" className="img-fluid" />
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

export default SolutionAndServicesForm;
