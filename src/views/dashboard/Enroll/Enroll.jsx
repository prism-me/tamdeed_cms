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
import "./Enroll.scss";
import CKEditor from "ckeditor4-react";
import { ckEditorConfig } from "../../../utils/data";
import { DeleteOutlined } from "@material-ui/icons";
import { API } from "../../../http/API";

const formSchema = Yup.object().shape({
    required: Yup.string().required("Required"),
});

const initialObj = {
    name: "Enroll-page",
    page_id: 4,
    slug: "Enroll-page",
    content: {
        intro: {
            title: "",
        },
        step1: {
            title: "",
        },
        step2: {
            title: "",
            description: "",
        },
        step3: {
            title: "",
            description: "",
        },
        step4: {
            title: "",
            description: "",
        },
        step5: {
            title: "",
            description: "",
        },
        documents: {
            description: "",
        },
        ageRequirement: {
            title: "",
            description: "",
        },
        ageRequirementModal: {
            description: "",
        },
        feesPayments: {
            description: "",
        },
        generalPolicies: {
            description: "",
        },
        applyOnline: {
            title: "",
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
            intro: {
                title: "",
            },
            step1: {
                title: "",
            },
            step2: {
                title: "",
                description: "",
            },
            step3: {
                title: "",
                description: "",
            },
            step4: {
                title: "",
                description: "",
            },
            step5: {
                title: "",
                description: "",
            },
            documents: {
                description: "",
            },
            ageRequirement: {
                title: "",
                description: "",
            },
            ageRequirementModal: {
                description: "",
            },
            feesPayments: {
                description: "",
            },
            generalPolicies: {
                description: "",
            },
            applyOnline: {
                title: "",
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

const Enroll = () => {
    const [enrollData, setEnrollData] = useState({ ...initialObj });
    const [pageData, setPageData] = useState();

    //!------------Pages Api Call------------
    useEffect(() => {
        API.get(`/pages`)
            .then((response) => {
                // debugger;
                if (response.status === 200 || response.status === 201) {
                    let currentPage = response.data.data.find((x) => x.slug === "Enroll-page");
                    setPageData(currentPage);
                    API.get(`/all_sections/${currentPage._id}`)
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

                            //   console.log("All widgets response", content);
                            setEnrollData({ ...initialObj, content });
                        })
                        .catch((err) => console.log(err));
                }
            })
            .catch((err) => console.log(err));
    }, []);

    //!*********** Handle Intro************
    //! __________Handle OnChange__________
    const handleIntroOnChange = (e) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.intro[e.target.name] = e.target.value;
        setEnrollData(updatedValue);
    };
    //! *********** Handle Step1************
    //! __________Handle OnChange__________

    const handleStep1OnChange = (e) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.step1[e.target.name] = e.target.value;
        setEnrollData(updatedValue);
    };
    //! *********** Handle Step2************
    //! __________Handle OnChange__________

    const handleStep2OnChange = (e) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.step2[e.target.name] = e.target.value;
        setEnrollData(updatedValue);
    };
    //! __________Handle Editor__________
    const handleStep2Editor = (value) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.step2.description = value;
        setEnrollData(updatedValue);
    };
    //! *********** Handle Step3************
    //! __________Handle OnChange__________

    const handleStep3OnChange = (e) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.step3[e.target.name] = e.target.value;
        setEnrollData(updatedValue);
    };
    //! __________Handle Editor__________
    const handleStep3Editor = (value) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.step3.description = value;
        setEnrollData(updatedValue);
    };
    //!*********** Handle documents************
    //! __________Handle Editor__________
    const handleDocumentsEditor = (value) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.documents.description = value;
        setEnrollData(updatedValue);
    };
    //! *********** Handle Step4************
    //! __________Handle OnChange__________

    const handleStep4OnChange = (e) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.step4[e.target.name] = e.target.value;
        setEnrollData(updatedValue);
    };
    //! __________Handle Editor__________
    const handleStep4Editor = (value) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.step4.description = value;
        setEnrollData(updatedValue);
    };
    //! *********** Handle Step5************
    //! __________Handle OnChange__________

    const handleStep5OnChange = (e) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.step5[e.target.name] = e.target.value;
        setEnrollData(updatedValue);
    };
    //! __________Handle Editor__________
    const handleStep5Editor = (value) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.step5.description = value;
        setEnrollData(updatedValue);
    };
    //!*********** Handle AgeRequirement Section************
    //! __________Handle OnChange__________

    const handleAgeRequirementOnChange = (e) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.ageRequirement[e.target.name] = e.target.value;
        setEnrollData(updatedValue);
    };
    //! __________Handle Editor__________
    const handleAgeRequirementEditor = (value) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.ageRequirement.description = value;
        setEnrollData(updatedValue);
    };
    //!*********** Handle AgeRequirementModal Section************
    //! __________Handle Editor__________
    const handleAgeRequirementModalEditor = (value) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.ageRequirementModal.description = value;
        setEnrollData(updatedValue);
    };
    //!*********** Handle Fees AND Payments Section************
    //! __________Handle Editor__________
    const handleFeesPaymentsEditor = (value) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.feesPayments.description = value;
        setEnrollData(updatedValue);
    };
    //!*********** Handle GeneralPolicies Section************
    //! __________Handle Editor__________
    const handleGeneralPoliciesEditor = (value) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.generalPolicies.description = value;
        setEnrollData(updatedValue);
    };
    //!*********** Handle ApplyOnline************
    //! __________Handle OnChange__________
    const handleApplyOnlineOnChange = (e) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.applyOnline[e.target.name] = e.target.value;
        setEnrollData(updatedValue);
    };
    //! *********** Handle Covid************
    //! __________Handle OnChange__________
    const handleCovidSectionOnChange = (e) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.covidSection[e.target.name] = e.target.value;
        setEnrollData(updatedValue);
    };
    //! __________Handle Editor__________
    const handleCovidSectionEditor = (value) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.covidSection.description = value;
        setEnrollData(updatedValue);
    };
    // //!----------ADD New Section------
    // const addNewSection = () => {
    //     let updatedValue = { ...enrollData };
    //     updatedValue.content.promoSection.push({
    //         video_link: "",
    //         images_detail: {
    //             title: "",
    //             content: "",
    //             background_image: "",
    //         },
    //     });
    //     setEnrollData(updatedValue);
    // };
    // //!--------Remove section------
    // const removeSection = (index) => {
    //     let updatedValue = { ...enrollData };
    //     let updatedSection = updatedValue.content.promoSection.filter(
    //         (x, i) => i !== index
    //     );
    //     updatedValue.content.promoSection = updatedSection;
    //     setEnrollData(updatedValue);
    // };
    //!--------Hanlde Meta Details OnChange---------
    const handleMetaOnChange = (e) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.meta_details[e.target.name] = e.target.value;
        setEnrollData(updatedValue);
    };

    //! *************************************************************
    //? *******************Arabic Section Function*******************
    //! *************************************************************

    //!*********** Handle Intro************
    //! __________Handle OnChange__________
    const handleArabicIntroOnChange = (e) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.arabic.intro[e.target.name] =
            e.target.value;
        setEnrollData(updatedValue);
    };
    //! *********** Handle Step1************
    //! __________Handle OnChange__________

    const handleArabicStep1OnChange = (e) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.arabic.step1[e.target.name] =
            e.target.value;
        setEnrollData(updatedValue);
    };
    //! *********** Handle Step2************
    //! __________Handle OnChange__________

    const handleArabicStep2OnChange = (e) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.arabic.step2[e.target.name] =
            e.target.value;
        setEnrollData(updatedValue);
    };
    //! __________Handle Editor__________
    const handleArabicStep2Editor = (value) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.arabic.step2.description = value;
        setEnrollData(updatedValue);
    };
    //! *********** Handle Step3************
    //! __________Handle OnChange__________

    const handleArabicStep3OnChange = (e) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.arabic.step3[e.target.name] =
            e.target.value;
        setEnrollData(updatedValue);
    };
    //! __________Handle Editor__________
    const handleArabicStep3Editor = (value) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.arabic.step3.description = value;
        setEnrollData(updatedValue);
    };
    //! *********** Handle Step4************
    //! __________Handle OnChange__________

    const handleArabicStep4OnChange = (e) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.arabic.step4[e.target.name] =
            e.target.value;
        setEnrollData(updatedValue);
    };
    //! __________Handle Editor__________
    const handleArabicStep4Editor = (value) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.arabic.step4.description = value;
        setEnrollData(updatedValue);
    };
    //! *********** Handle Step5************
    //! __________Handle OnChange__________

    const handleArabicStep5OnChange = (e) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.arabic.step5[e.target.name] =
            e.target.value;
        setEnrollData(updatedValue);
    };
    //! __________Handle Editor__________
    const handleArabicStep5Editor = (value) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.arabic.step5.description = value;
        setEnrollData(updatedValue);
    };
    //!*********** Handle Documents************
    //! __________Handle Editor__________
    const handleArabicDocumentsEditor = (value) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.arabic.documents.description = value;
        setEnrollData(updatedValue);
    };
    //!*********** Handle AgeRequirement************
    //! __________Handle OnChange__________

    const handleArabicAgeRequirementOnChange = (e) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.arabic.ageRequirement[e.target.name] =
            e.target.value;
        setEnrollData(updatedValue);
    };
    //! __________Handle Editor__________
    const handleArabicAgeRequirementEditor = (value) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.arabic.ageRequirement.description = value;
        setEnrollData(updatedValue);
    };
    //!*********** Handle AgeRequirementModal Section************
    //! __________Handle Editor__________
    const handleArabicAgeRequirementModalEditor = (value) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.arabic.ageRequirementModal.description = value;
        setEnrollData(updatedValue);
    };
    //!*********** Handle FEES & Payments************
    //! __________Handle Editor__________
    const handleArabicFeesPaymentsEditor = (value) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.arabic.feesPayments.description = value;
        setEnrollData(updatedValue);
    };
    //!*********** Handle GeneralPolicies Section************
    //! __________Handle Editor__________
    const handleArabicGeneralPoliciesEditor = (value) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.arabic.generalPolicies.description = value;
        setEnrollData(updatedValue);
    };
    //!*********** Handle ApplyOnline************
    //! __________Handle OnChange__________

    const handleArabicApplyOnlineOnChange = (e) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.arabic.applyOnline[e.target.name] =
            e.target.value;
        setEnrollData(updatedValue);
    };
    //!*********** Handle CovidSection************
    //! __________Handle OnChange__________

    const handleArabicCovidSectionOnChange = (e) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.arabic.covidSection[e.target.name] =
            e.target.value;
        setEnrollData(updatedValue);
    };
    //! __________Handle Editor__________
    const handleArabicCovidSectionEditor = (value) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.arabic.covidSection.description = value;
        setEnrollData(updatedValue);
    };
    // //!----------ADD New Section------
    // const addArabicNewSection = () => {
    //     let updatedValue = { ...enrollData };
    //     updatedValue.content.arabic.promoSection.push({
    //         images_detail: {
    //             title: "",
    //             content: "",
    //         },
    //     });
    //     setEnrollData(updatedValue);
    // };
    // //!--------Remove section------
    // const removeArabicSection = (index) => {
    //     let updatedValue = { ...enrollData };
    //     let updatedSection = updatedValue.content.arabic.promoSection.filter(
    //         (x, i) => i !== index
    //     );
    //     updatedValue.content.arabic.promoSection = updatedSection;
    //     setEnrollData(updatedValue);
    // };

    //!--------Hanlde Meta Details OnChange---------
    const handleArabicMetaOnChange = (e) => {
        let updatedValue = { ...enrollData };
        updatedValue.content.arabic.meta_details[e.target.name] =
            e.target.value;
        setEnrollData(updatedValue);
    };
    //! --------------Handle Submit-------------
    const handleSubmit = () => {
        let updatedData = { ...enrollData, page_id: pageData._id };
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
            {/* //! **************Documents Intro Section*************** */}
            <Card className="slider-bottom-section">
                <CardHeader>
                    <CardTitle>Introduction Section</CardTitle>
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
                                            <CardHeader id="item-1">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Introduction
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
                                                            onChange={handleIntroOnChange}
                                                            value={enrollData?.content?.intro?.title}
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
            {/* //! *********************Admission Procedure***************************** */}
            <Card className="home-form">
                <CardHeader>
                    <CardTitle>Admission Procedure Section</CardTitle>
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
                                {/* //! **************Step One************** */}
                                <div className="variation-row-wrapper mb-2">
                                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                        <Card>
                                            <CardHeader id="item-2">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Step One
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
                                                            onChange={handleStep1OnChange}
                                                            value={enrollData?.content?.step1?.title}
                                                            className={`form-control`}
                                                        />
                                                    </FormGroup>
                                                </CardBody>
                                            </UncontrolledCollapse>
                                        </Card>
                                    </div>
                                </div>
                                {/* //! **************Step Two************** */}
                                <div className="variation-row-wrapper mb-2">
                                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                        <Card>
                                            <CardHeader id="item-3">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Step Two
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
                                                            onChange={handleStep2OnChange}
                                                            value={enrollData?.content?.step2?.title}
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
                                                                        enrollData?.content?.step2
                                                                            ?.description
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleStep2Editor(e.editor.getData())
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
                                {/* //! **************Step Three************** */}
                                <div className="variation-row-wrapper mb-2">
                                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                        <Card>
                                            <CardHeader id="item-4">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Step Three
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
                                                            onChange={handleStep3OnChange}
                                                            value={enrollData?.content?.step3?.title}
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
                                                                        enrollData?.content?.step3
                                                                            ?.description
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleStep3Editor(e.editor.getData())
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
                                {/* //! **************Step Four************** */}
                                <div className="variation-row-wrapper mb-2">
                                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                        <Card>
                                            <CardHeader id="item-5">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Step Four
                                                </CardTitle>
                                                {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                            </CardHeader>
                                            <UncontrolledCollapse toggler="#item-5">
                                                <CardBody>
                                                    <FormGroup className="mb-1">
                                                        <Label for="title">Title</Label>
                                                        <Field
                                                            name="title"
                                                            id="title"
                                                            onChange={handleStep4OnChange}
                                                            value={enrollData?.content?.step4?.title}
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
                                                                        enrollData?.content?.step4
                                                                            ?.description
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleStep4Editor(e.editor.getData())
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
                                {/* //! **************Step Five************** */}
                                <div className="variation-row-wrapper mb-2">
                                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                        <Card>
                                            <CardHeader id="item-6">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Step Five
                                                </CardTitle>
                                                {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                            </CardHeader>
                                            <UncontrolledCollapse toggler="#item-6">
                                                <CardBody>
                                                    <FormGroup className="mb-1">
                                                        <Label for="title">Title</Label>
                                                        <Field
                                                            name="title"
                                                            id="title"
                                                            onChange={handleStep5OnChange}
                                                            value={enrollData?.content?.step5?.title}
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
                                                                        enrollData?.content?.step5
                                                                            ?.description
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleStep5Editor(e.editor.getData())
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
            {/* //! **************Documents To be Submitted  Section*************** */}
            <Card className="slider-bottom-section">
                <CardHeader>
                    <CardTitle>Documents To be Submitted  Section</CardTitle>
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
                                            <CardHeader id="item-7">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Documents To be Submitted
                                                </CardTitle>
                                                {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                            </CardHeader>
                                            <UncontrolledCollapse toggler="#item-7">
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
                                                                        enrollData?.content?.documents
                                                                            ?.description
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleDocumentsEditor(e.editor.getData())
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
            {/* //! **************Age Requirements Section*************** */}
            <Card className="welcome-section">
                <CardHeader>
                    <CardTitle>Age Requirements Section</CardTitle>
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
                                            <CardHeader id="item-8">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Age Requirements
                                                </CardTitle>
                                                {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                            </CardHeader>
                                            <UncontrolledCollapse toggler="#item-8">
                                                <CardBody>
                                                    <FormGroup className="mb-1">
                                                        <Label for="title">Title</Label>
                                                        <Field
                                                            name="title"
                                                            id="title"
                                                            onChange={handleAgeRequirementOnChange}
                                                            value={
                                                                enrollData?.content?.ageRequirement?.title
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
                                                                        enrollData?.content?.ageRequirement
                                                                            ?.description
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleAgeRequirementEditor(e.editor.getData())
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
            {/* //! **************Age Requirements Table Section*************** */}
            <Card className="welcome-section">
                <CardHeader>
                    <CardTitle>Age Requirements Table Section</CardTitle>
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
                                            <CardHeader id="item-9">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Age Requirements Table
                                                </CardTitle>
                                                {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                            </CardHeader>
                                            <UncontrolledCollapse toggler="#item-9">
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
                                                                        enrollData?.content?.ageRequirementModal
                                                                            ?.description
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleAgeRequirementModalEditor(e.editor.getData())
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
            {/* //! **************Fees & Payments Table Section*************** */}
            <Card className="welcome-section">
                <CardHeader>
                    <CardTitle>Fees & Payments Section</CardTitle>
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
                                            <CardHeader id="item-10">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Fees & Payments
                                                </CardTitle>
                                                {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                            </CardHeader>
                                            <UncontrolledCollapse toggler="#item-10">
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
                                                                        enrollData?.content?.feesPayments
                                                                            ?.description
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleFeesPaymentsEditor(e.editor.getData())
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
            {/* //! **************General Policies Section*************** */}
            <Card className="welcome-section">
                <CardHeader>
                    <CardTitle>General Policies Section</CardTitle>
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
                                            <CardHeader id="item-11">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    General Policies
                                                </CardTitle>
                                                {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                            </CardHeader>
                                            <UncontrolledCollapse toggler="#item-11">
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
                                                                        enrollData?.content?.generalPolicies
                                                                            ?.description
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleGeneralPoliciesEditor(e.editor.getData())
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
            {/* //! **************Apply Online Section*************** */}
            <Card className="welcome-section">
                <CardHeader>
                    <CardTitle>Apply Online Section</CardTitle>
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
                                            <CardHeader id="item-12">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Apply Online
                                                </CardTitle>
                                                {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                            </CardHeader>
                                            <UncontrolledCollapse toggler="#item-12">
                                                <CardBody>
                                                    <FormGroup className="mb-1">
                                                        <Label for="title">Title</Label>
                                                        <Field
                                                            name="title"
                                                            id="title"
                                                            onChange={handleApplyOnlineOnChange}
                                                            value={
                                                                enrollData?.content?.applyOnline?.title
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
                                            <CardHeader id="item-12">
                                                <CardTitle className="lead collapse-title collapsed">
                                                    Covid
                                                </CardTitle>
                                                {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                            </CardHeader>
                                            <UncontrolledCollapse toggler="#item-12">
                                                <CardBody>
                                                    <FormGroup className="mb-1">
                                                        <Label for="title">Title</Label>
                                                        <Field
                                                            name="title"
                                                            id="title"
                                                            onChange={handleCovidSectionOnChange}
                                                            value={
                                                                enrollData?.content?.covidSection?.title
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
                                                                        enrollData?.content?.covidSection
                                                                            ?.description
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleCovidSectionEditor(e.editor.getData())
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
                                                value={enrollData?.content?.meta_details?.title}
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
                                                    enrollData?.content?.meta_details?.description
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
                                                    enrollData?.content?.meta_details?.schema_markup
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
                {/* //! **************Age Intro Section*************** */}
                <Card className="arabic-welcome-section">
                    <CardHeader>
                        <CardTitle>Introduction Section</CardTitle>
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
                                                <CardHeader id="item-1">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        Introduction
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
                                                                onChange={handleArabicIntroOnChange}
                                                                value={
                                                                    enrollData?.content?.arabic
                                                                        ?.intro?.title
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
                {/* //! *************************Admission Procedure************************ */}
                <Card className="arabic-home-form">
                    <CardHeader>
                        <CardTitle>Arabic Admission Procedure Section</CardTitle>
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
                                    {/* //! **************Step One************** */}
                                    <div className="variation-row-wrapper mb-2">
                                        <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                            <Card>
                                                <CardHeader id="item-2">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        Step One
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
                                                                onChange={handleArabicStep1OnChange}
                                                                value={
                                                                    enrollData?.content?.arabic?.step1
                                                                        ?.title
                                                                }
                                                                className={`form-control`}
                                                            />
                                                        </FormGroup>
                                                    </CardBody>
                                                </UncontrolledCollapse>
                                            </Card>
                                        </div>
                                    </div>
                                    {/* //! **************Step Two************** */}
                                    <div className="variation-row-wrapper mb-2">
                                        <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                            <Card>
                                                <CardHeader id="item-3">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        Step Two
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
                                                                onChange={handleArabicStep2OnChange}
                                                                value={
                                                                    enrollData?.content?.arabic?.step2
                                                                        ?.title
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
                                                                            enrollData?.content?.arabic
                                                                                ?.step2?.description
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleArabicStep2Editor(
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
                                    {/* //! **************Step Three************** */}
                                    <div className="variation-row-wrapper mb-2">
                                        <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                            <Card>
                                                <CardHeader id="item-4">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        Step Three
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
                                                                onChange={handleArabicStep3OnChange}
                                                                value={
                                                                    enrollData?.content?.arabic?.step3
                                                                        ?.title
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
                                                                            enrollData?.content?.arabic
                                                                                ?.step3?.description
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleArabicStep3Editor(
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
                                    {/* //! **************Step Four************** */}
                                    <div className="variation-row-wrapper mb-2">
                                        <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                            <Card>
                                                <CardHeader id="item-5">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        Step Four
                                                    </CardTitle>
                                                    {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                                </CardHeader>
                                                <UncontrolledCollapse toggler="#item-5">
                                                    <CardBody>
                                                        <FormGroup className="mb-1">
                                                            <Label for="title">Title</Label>
                                                            <Field
                                                                name="title"
                                                                id="title"
                                                                onChange={handleArabicStep4OnChange}
                                                                value={
                                                                    enrollData?.content?.arabic?.step4
                                                                        ?.title
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
                                                                            enrollData?.content?.arabic
                                                                                ?.step4?.description
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleArabicStep4Editor(
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
                                    {/* //! **************Step Five************** */}
                                    <div className="variation-row-wrapper mb-2">
                                        <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                            <Card>
                                                <CardHeader id="item-6">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        Step Five
                                                    </CardTitle>
                                                    {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                                </CardHeader>
                                                <UncontrolledCollapse toggler="#item-6">
                                                    <CardBody>
                                                        <FormGroup className="mb-1">
                                                            <Label for="title">Title</Label>
                                                            <Field
                                                                name="title"
                                                                id="title"
                                                                onChange={handleArabicStep5OnChange}
                                                                value={
                                                                    enrollData?.content?.arabic?.step5
                                                                        ?.title
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
                                                                            enrollData?.content?.arabic
                                                                                ?.step5?.description
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleArabicStep5Editor(
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
                {/* //! **************Documents To be Submitted Section*************** */}
                <Card className="arabic-slider-bottom-section">
                    <CardHeader>
                        <CardTitle>Documents To be Submitted Section</CardTitle>
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
                                                <CardHeader id="item-7">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        Documents To be Submitted
                                                    </CardTitle>
                                                    {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                                </CardHeader>
                                                <UncontrolledCollapse toggler="#item-7">
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
                                                                            enrollData?.content?.arabic
                                                                                ?.documents?.description
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleArabicDocumentsEditor(e.editor.getData())
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
                {/* //! **************Age Requirements Section*************** */}
                <Card className="arabic-welcome-section">
                    <CardHeader>
                        <CardTitle>Age Requirements Section</CardTitle>
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
                                                <CardHeader id="item-8">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        Age Requirements
                                                    </CardTitle>
                                                    {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                                </CardHeader>
                                                <UncontrolledCollapse toggler="#item-8">
                                                    <CardBody>
                                                        <FormGroup className="mb-1">
                                                            <Label for="title">Title</Label>
                                                            <Field
                                                                name="title"
                                                                id="title"
                                                                onChange={handleArabicAgeRequirementOnChange}
                                                                value={
                                                                    enrollData?.content?.arabic
                                                                        ?.ageRequirement?.title
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
                                                                            enrollData?.content?.arabic
                                                                                ?.ageRequirement?.description
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleArabicAgeRequirementEditor(
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
                {/* //! **************Age Requirements Table Section*************** */}
                <Card className="arabic-welcome-section">
                    <CardHeader>
                        <CardTitle>Age Requirements Table Section</CardTitle>
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
                                                <CardHeader id="item-9">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        Age Requirements Table
                                                    </CardTitle>
                                                    {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                                </CardHeader>
                                                <UncontrolledCollapse toggler="#item-9">
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
                                                                            enrollData?.content?.arabic
                                                                                ?.ageRequirementModal?.description
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleArabicAgeRequirementModalEditor(
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
                {/* //! **************Fees & Payments Table Section*************** */}
                <Card className="arabic-welcome-section">
                    <CardHeader>
                        <CardTitle>Fees & Payments Section</CardTitle>
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
                                                <CardHeader id="item-10">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        Fees & Payments
                                                    </CardTitle>
                                                    {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                                </CardHeader>
                                                <UncontrolledCollapse toggler="#item-10">
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
                                                                            enrollData?.content?.arabic
                                                                                ?.feesPayments?.description
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleArabicFeesPaymentsEditor(
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
                {/* //! **************General Policies Section*************** */}
                <Card className="arabic-welcome-section">
                    <CardHeader>
                        <CardTitle>General Policies Section</CardTitle>
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
                                                <CardHeader id="item-11">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        General Policies
                                                    </CardTitle>
                                                    {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                                </CardHeader>
                                                <UncontrolledCollapse toggler="#item-11">
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
                                                                            enrollData?.content?.arabic
                                                                                ?.generalPolicies?.description
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleArabicGeneralPoliciesEditor(
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
                {/* //! **************Apply Online Section*************** */}
                <Card className="arabic-welcome-section">
                    <CardHeader>
                        <CardTitle>Apply Online Section</CardTitle>
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
                                                <CardHeader id="item-12">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        Apply Online
                                                    </CardTitle>
                                                    {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                                </CardHeader>
                                                <UncontrolledCollapse toggler="#item-12">
                                                    <CardBody>
                                                        <FormGroup className="mb-1">
                                                            <Label for="title">Title</Label>
                                                            <Field
                                                                name="title"
                                                                id="title"
                                                                onChange={handleArabicApplyOnlineOnChange}
                                                                value={
                                                                    enrollData?.content?.arabic
                                                                        ?.applyOnline?.title
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
                                                <CardHeader id="item-13">
                                                    <CardTitle className="lead collapse-title collapsed">
                                                        Covid
                                                    </CardTitle>
                                                    {/* <ChevronDown size={15} className="collapse-icon" /> */}
                                                </CardHeader>
                                                <UncontrolledCollapse toggler="#item-13">
                                                    <CardBody>
                                                        <FormGroup className="mb-1">
                                                            <Label for="title">Title</Label>
                                                            <Field
                                                                name="title"
                                                                id="title"
                                                                onChange={handleArabicCovidSectionOnChange}
                                                                value={
                                                                    enrollData?.content?.arabic
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
                                                                            enrollData?.content?.arabic
                                                                                ?.covidSection?.description
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleArabicCovidSectionEditor(
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
                                                        enrollData?.content?.arabic?.meta_details
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
                                                        enrollData?.content?.arabic?.meta_details
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
                                                        enrollData?.content?.arabic?.meta_details
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

export default Enroll;
