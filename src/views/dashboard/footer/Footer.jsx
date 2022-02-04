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
import { TextField, Paper, IconButton } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Snackbar from "@material-ui/core/Snackbar";

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
      facebook: "",
      twitter: "",
      instagram: "",
  };

  const [openSnackAlert, setOpenSnackAlert] = useState(false);
  const [messageInfo, setMessageInfo] = React.useState(undefined);

  const [dragId, setDragId] = useState();
  const [footerContent, setFooterContent] = useState({ ...initialObject });
  const [pages, setPages] = useState([]);
  const [pagesFilter, setPagesFilter] = useState([]);
  const [pageData, setPageData] = useState();

  useEffect(() => {
    API.get(`/pages`)
        .then((response) => {
            // debugger;
            if (response.status === 200 || response.status === 201) {
                let currentPage = response.data.data.find((x) => x.slug === "footer");
                setPageData(currentPage);
                API.get(`/all_sections/${currentPage._id}`)
                    .then((res) => {
                        console.log("res.data.data",res.data.data)
                        if(res.data.data.length > 0){
                          setFooterContent(res.data.data[0]);
                        }
                        
                    })
                    .catch((err) => console.log(err));
            }
        })
        .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (section) => {
    
    
    API[footerContent[section]?.id ? "put" : "post"](
      footerContent[section]?.id
        ? `/widget/${footerContent[section]?.id}`
        : `/widget`,
      {
        widget_type: "footer",
        widget_name: section,
        items: footerContent[section],
      }
    )
      .then((response) => {
        if (response.status === 200) {
          // alert(response.data.message);
          setMessageInfo((prev) => [
            ...prev,
            { message: response.data.message, key: new Date().getTime() },
          ]);
          setOpenSnackAlert(true);
          // setFooterContent({ ...initialObject }); //resetting the form
        }
      })
      .catch((err) => alert("Something went wrong"));
  };

  const handleFooterOnChange = (e) => {
    let updatedValue = { ...footerContent };
    updatedValue[e.target.name] = e.target.value;
    setFooterContent(updatedValue);
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
                    <Input type="text" name="facebook" onChange={handleFooterOnChange} value={footerContent?.facebook} />
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label> Twitter </Label>
                    <Input type="text" name="twitter" onChange={handleFooterOnChange} value={footerContent?.twitter}/>
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label> Instagram </Label>
                    <Input type="text" name="instagram" onChange={handleFooterOnChange} value={footerContent?.instagram} />
                  </FormGroup>
                </Col>
                  <Grid item xs={12} sm={12}>
                    <MaterialButton
                      onClick={() => handleSubmit("first")}
                      color="primary"
                      variant="contained"
                    >
                      Update Section
                    </MaterialButton>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
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
