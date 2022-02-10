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
import "./UserQueryForm.scss";
import CKEditor from "ckeditor4-react";
import { ckEditorConfig } from "../../../../utils/data";
import GalleryModal from "../../gallery-modal/GalleryModal";
import { API } from "../../../../http/API";
import { UpdateTwoTone } from "@material-ui/icons";


const formSchema = Yup.object().shape({
    required: Yup.string().required("Required"),
});

const initialObj = {
    name: "",
    avatar: "",
    alt_tag : "alt"
};

const PartnerForm = (props) => {
    const history = useHistory();
    const { id } = useParams();
    const [partner, setPartner] = useState({ ...initialObj });
    const [modalShow, setModalShow] = React.useState(false);
    const [imagesData, setImagesData] = useState([]);
    const [isSingle, setIsSingle] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [isBanner, setIsBanner] = useState(false);


    useEffect(() => {
        if (id && id !== "") {
            API.get(`/contact/${id}`)
                .then((response) => {

                    if (response.status === 200 || response.status === 201) {
                        setPartner(response.data.data[0]);

                    }
                })
                .catch((err) => console.log(err));
        }
    }, []);

    const handleImageSelect = (e, index) => {
      // console.log(imagesData[index].alt_tag)
        if (e.target.checked) {
            if (isSingle && !isBanner) {
                setPartner({
                    ...partner,
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
      let updatedValues = { ...partner };
        updatedValues[e.target.name] = e.target.value;
        setPartner(updatedValues);
    }

    //!------------------Submit and Edit---------------

    return (
        <>
            <Card className="feeding-advisor-form">
                <CardHeader>
                    <CardTitle>
                        User Query
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
                                <Row>
                                    <Col sm={9}>
                                    <FormGroup className="mb-1">
                                        <Label for="name">Name</Label>
                                        <Field
                                            disabled
                                            name="name"
                                            id="name"
                                            value={partner.name}
                                            className={`form-control`}
                                        />
                                    </FormGroup>
                                    </Col>
                                    <Col sm={9}>
                                    <FormGroup className="mb-1">
                                        <Label for="name">Email</Label>
                                        <Field
                                            disabled
                                            name="name"
                                            id="name"
                                            value={partner.email}
                                            className={`form-control`}
                                        />
                                    </FormGroup>
                                    </Col>
                                    <Col sm={9}>
                                    <FormGroup className="mb-1">
                                        <Label for="name">Phone</Label>
                                        <Field
                                            disabled
                                            name="name"
                                            id="name"
                                            value={partner.phone}
                                            className={`form-control`}
                                        />
                                    </FormGroup>
                                    </Col>
                                    <Col sm={9}>
                                    <FormGroup className="mb-1">
                                        <Label for="name">Subject</Label>
                                        <Field
                                            disabled
                                            name="name"
                                            id="name"
                                            value={partner.subject}
                                            className={`form-control`}
                                        />
                                    </FormGroup>
                                    </Col>
                                    <Col sm={9}>
                                    <FormGroup className="mb-1">
                                        <Label for="name">Message</Label>
                                        <Input
                                            name="description"
                                            id="description"
                                            value={partner.message}
                                            className={`form-control`}
                                            type="textarea"
                                            rows="4"
                                            disabled
                                        />
                                    </FormGroup>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                </CardBody>
            </Card>

            <Card>
                <CardBody>
                    {/* //!----------Submit Button--------------- */}
                    <Button.Ripple
                        onClick={'handleSubmit'}
                        color="primary"
                        type="submit"
                        className="mt-2"
                        onClick={() => {
                            history.goBack();
                        }}
                    >
                        {"close"}
                    </Button.Ripple>
                </CardBody>
            </Card>
        </>
    );
};

export default PartnerForm;
