import React, { Fragment, Suspense, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
// import GridItem from "components/Grid/GridItem.js";
// import GridContainer from "components/Grid/GridContainer.js";
// import CustomInput from "components/CustomInput/CustomInput.js";
import Grid from "@material-ui/core/Grid";
// import Paper from '@material-ui/core/Paper';

// import Button from "components/CustomButtons/Button.js";
import MaterialButton from "@material-ui/core/Button";
// import Card from "components/Card/Card.js";
// import CardHeader from "components/Card/CardHeader.js";
// // import CardAvatar from "components/Card/CardAvatar.js";
// import CardBody from "components/Card/CardBody.js";
// import CardFooter from "components/Card/CardFooter.js";

// import avatar from "assets/img/faces/marc.jpg";

import { AddCircleOutline, DeleteOutlined } from "@material-ui/icons";

import { TextField, Paper, IconButton } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Snackbar from "@material-ui/core/Snackbar";
import GalleryModal from "../gallery-modal/GalleryModal";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import { API } from "../../../http/API";
import { CloseOutlined } from "@material-ui/icons";
import {
  Card,
  CardHeader,
  CardTitle,
  CustomInput,
  CardBody,
  Button,
  Label,
  FormGroup,
  Col,
  Row,
  Input,
  UncontrolledCollapse,
} from "reactstrap";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

export default function UpdateFooter() {
  const classes = useStyles();
  // const [open, setOpen] = React.useState(false);
  const initialObject = {
    name: "footer",
    slug: "footer",
    content: {
      facebook: "",
      twitter: "",
      instagram: "",
      footerPartnersLogo: [
        {
          footerlogo: "",
          logoUrl: "",
        }
      ],
      footerAboutText: "",
    }
  };

  const [openSnackAlert, setOpenSnackAlert] = useState(false);
  const [messageInfo, setMessageInfo] = React.useState(undefined);

  const [footerContent, setFooterContent] = useState({ ...initialObject });
  const [pages, setPages] = useState([]);
  const [pagesFilter, setPagesFilter] = useState([]);
  const [pageData, setPageData] = useState();
  const [sectionID, setSectionID] = useState(0);
  const [modalShow, setModalShow] = React.useState(false);
  const [imagesData, setImagesData] = useState([]);
  const [isSingle, setIsSingle] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);


  useEffect(() => {
    API.get('get_all_images')
      .then((response) => {
        setImagesData(
          response.data.data
        );

      });
  }, []);

  const getGalleryImages = () => {
    API.get('get_all_images')
      .then((response) => {
        // debugger;
        setImagesData(
          response.data.data
        );
      });
  }

  useEffect(() => {
    API.get(`/pages`)
      .then((response) => {
        // debugger;
        if (response.status === 200 || response.status === 201) {
          let currentPage = response.data.data.find((x) => x.slug === "footer");
          setPageData(currentPage);
          API.get(`/all_sections/${currentPage._id}`)
            .then((res) => {
              if (res.data.data.length > 0) {
                setFooterContent(res.data.data[0]);
                setSectionID(res.data.data[0]._id)
              }

            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (section) => {

    let updatedData = { ...footerContent, page_id: pageData._id };
    delete updatedData._id
    if (sectionID) {
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

  const handleFooterOnChange = (e) => {
    let updatedValue = { ...footerContent };
    updatedValue.content[e.target.name] = e.target.value;
    setFooterContent(updatedValue);
  };

  const handleFooterPartnersOnChange = (e, index) => {
    let updatedValue = { ...footerContent };
    updatedValue.content.footerPartnersLogo[index].logoUrl = e.target.value;
    setFooterContent(updatedValue);
  };

  const handleImageSelect = (e, index) => {
    if (e.target.checked) {
      if (isSingle) {
        let updateData = { ...footerContent };
        updateData.content.footerPartnersLogo[activeIndex].footerlogo = imagesData[index].url
        setFooterContent(updateData);

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

  const handleFootertem = (type, index) => {

    // debugger;
    if (type === "delete") {
      let productUp = { ...footerContent }
      productUp.content.footerPartnersLogo.splice(index, 1)
      setFooterContent(productUp);
    }
    if (type === "add") {
      let newItem = {
        footerlogo: "",
        logoUrl: "",
      }
      let productUp = { ...footerContent }
      productUp.content.footerPartnersLogo.push(newItem)
      setFooterContent(productUp)
    }

  };

  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader color="primary">
            <h4 className="mb-0">Site Footer</h4>
          </CardHeader>

          <CardBody className="">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>
                  Social Media Links
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* <h4 className="mt-2">First Column (About)</h4> */}
                <Grid container spacing={2}>
                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label> Facebook </Label>
                      <Input type="text" name="facebook" onChange={handleFooterOnChange} value={footerContent?.content?.facebook} />
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label> Twitter </Label>
                      <Input type="text" name="twitter" onChange={handleFooterOnChange} value={footerContent?.content?.twitter} />
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label> Instagram </Label>
                      <Input type="text" name="instagram" onChange={handleFooterOnChange} value={footerContent?.content?.instagram} />
                    </FormGroup>
                  </Col>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </CardBody>
        </Card>

        <Card>
          <CardBody style={{ border: "1px solid rgb(201, 194, 194)", boxShadow: "0 0px 10px 0 rgba(0, 0, 0, 0.14)", marginBottom: "5px" }}>
            <h3 style={{ marginBottom: '2rem'}}>Footer Partners Logo</h3>
            <Grid container spacing={2} style={{ display: "flex" }}>
              <Grid item xs={12} sm={12}>
                <Grid container spacing={2}>
                  <>
                    {footerContent?.content?.footerPartnersLogo?.map((item, index) => (
                      <>

                        <Grid item xs={12} sm={12}>
                          <FormGroup>
                            <Label> Logo Url </Label>
                            <Input type="text" name="logoURL" onChange={(e) => handleFooterPartnersOnChange(e, index)} value={item?.logoUrl} />
                          </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FormGroup className="">
                            <Label for="avatar">Logo Image</Label>
                            <div className="clearfix" />
                            <div className="img-preview-wrapper">
                              {item?.footerlogo !== "" && (
                                <img src={item?.footerlogo} alt="" className="img-fluid" />
                              )}
                            </div>
                            <Button.Ripple
                              color="primary"
                              className="p-1"
                              onClick={() => {
                                setIsSingle(true);
                                setModalShow(true);
                                setActiveIndex(index);
                              }}
                            >
                              Add Image
                            </Button.Ripple>
                          </FormGroup>
                        </Grid>

                        <Grid item xs={12} sm={12} style={{ display: "flex", alignItems: "center", columnGap: "5px" }}>
                          {index == footerContent?.content?.footerPartnersLogo?.length - 1 &&
                            <AddCircleOutline
                              style={{ cursor: "pointer", fontSize: "30px" }}
                              titleAccess="Add item"
                              onClick={() => handleFootertem("add")}
                              color="primary"
                            />
                          }

                          {footerContent?.content?.footerPartnersLogo.length > 1 &&
                            <DeleteOutlined
                              style={{ cursor: "pointer", fontSize: "30px" }}
                              titleAccess="Delete Item"
                              onClick={() => handleFootertem("delete", index)}
                              color="primary"
                            />
                          }
                        </Grid>
                      </>
                    ))}
                  </>
                  <Grid>
                  </Grid>
                  <GalleryModal
                    open={modalShow}
                    handleClose={() => setModalShow(false)}
                    handleImageSelect={handleImageSelect}
                    data={imagesData}
                    refreshData={getGalleryImages}
                  />
                </Grid>
              </Grid>
            </Grid>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Grid item xs={12} sm={12}>
              <MaterialButton
                onClick={() => handleSubmit("first")}
                color="primary"
                variant="contained"
              >
                Update Section
              </MaterialButton>
            </Grid>

          </CardBody>
        </Card>

      </div>
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={openSnackAlert}
        autoHideDuration={3000}
        onClose={() => setOpenSnackAlert(false)}
        onExited={() => setOpenSnackAlert(false)}
        message={messageInfo ? messageInfo.message : undefined}
        action={
          <React.Fragment>
            <Button
              color="secondary"
              size="small"
              onClick={() => setOpenSnackAlert(false)}
            >
              OK
            </Button>
            <IconButton
              aria-label="close"
              color="inherit"
              className={classes.close}
              onClick={() => setOpenSnackAlert(false)}
            >
              <CloseOutlined />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}
