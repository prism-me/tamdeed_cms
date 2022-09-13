import React, { Fragment, Suspense, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import MaterialButton from "@material-ui/core/Button";
import {
  Card,
  CardHeader,
  CustomInput,
  CardBody,
  Label,
  FormGroup,
  Button,
  Input,
} from "reactstrap";
import { TextField, Paper } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import { API } from "../../../http/API";
import {
  AddCircleOutline,
  CloseOutlined,
  DragHandleOutlined,
} from "@material-ui/icons";
import GalleryModal from "../gallery-modal/GalleryModal";
import dummyImg from "../../../assets/img/placeholder.png";

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

export default function UpdateHeader() {
  const classes = useStyles();
  const initialObject = {
    name: "header",
    slug: "header",
    content: {
      hedaerLogo: "",
      hedaerLogoText: ""
    },
  };
  const [headerContent, setHeaderContent] = useState({ ...initialObject });
  const [currentPage, setCurrentPage] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);
  const [imagesData, setImagesData] = useState([]);
  const [isSingle, setIsSingle] = useState(false);
  const [sectionID, setSectionID] = useState(0);

  //!--------------------------
  const [pageData, setPageData] = useState();

  //!------Pages Api Call---------

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
          let currentPage = response.data.data.find((x) => x.slug === "header");
          setPageData(currentPage);
          API.get(`/all_sections/${currentPage._id}`)
            .then((res) => {
              console.log(res.data)
              if (res.data.data.length > 0) {
                setHeaderContent(res.data.data[0]);
                setSectionID(res.data.data[0]._id)
              }

            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleImageSelect = (e, index) => {
    if (e.target.checked) {
      if (isSingle) {
        let updateData = { ...headerContent };
        updateData.content.hedaerLogo = imagesData[index].url
        setHeaderContent(updateData);

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

  const handleOnChange = (e) => {
    let updatedValue = { ...headerContent };
    updatedValue.content[e.target.name] = e.target.value;
    setHeaderContent(updatedValue);
  };
  const handleSubmit = (section) => {

    let updatedData = { ...headerContent, page_id: pageData._id };
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

  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader color="primary">
            <h4 className="mb-0">Update Site Header Logo</h4>
          </CardHeader>
          <CardBody>
            <Grid container spacing={2} style={{ display: "flex" }}>
              <Grid item xs={12} sm={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormGroup className="">
                      <div className="clearfix" />
                      <div className="thumbnail-preview-wrapper img-thumbnail">
                        {headerContent?.content?.hedaerLogo ?
                          <img src={headerContent?.content?.hedaerLogo} alt={""} style={{ width: "100%" }} />
                          :
                          <img src={dummyImg} alt="" style={{ width: "100%" }} />
                        }
                      </div>
                      <Button.Ripple
                        style={{ marginTop: '30px' }}
                        color="primary"
                        className="p-1"
                        onClick={() => {
                          setIsSingle(true);
                          setModalShow(true);
                        }}
                      >
                        Add Image
                      </Button.Ripple>
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormGroup>
                      <Label> Logo Text </Label>
                      <Input
                        type="text"
                        name="hedaerLogoText"
                        onChange={handleOnChange}
                        value={headerContent?.content?.hedaerLogoText}
                      />
                    </FormGroup>
                  </Grid>
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
    </div >
  );
}
