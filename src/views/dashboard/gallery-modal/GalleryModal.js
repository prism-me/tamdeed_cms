import React, { useState, useEffect, useMemo } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import { CloudUploadOutlined, DeleteOutlined, ExitToApp } from "@material-ui/icons";
import "./GalleryModal.scss";
import { FormGroup, Input, Label } from "reactstrap";
import { API } from '../../../http/API';


export default function GalleryDialog(props) {
  const [currentFiles, setCurrentFiles] = useState([]);
  const [allImages, setAllImages] = useState([]);
 
  useEffect(() => {
    if (props?.data?.length > 0) {
      setAllImages(props?.data);
    }
  }, [props.data]);

  //!-------------------------------Upload Image-----------------------------//
  const handleFileDrop = (files) => {
    let updatedFiles = files.map((x) => ({
      file: x,
      is360: false,
      alt_text: "",
    }));
    // setCurrentFiles(updatedFiles);
    if (currentFiles.length > 0) {
      setCurrentFiles([...currentFiles, ...updatedFiles]);
    }
    else {
      setCurrentFiles(updatedFiles);
    }
  };

  const handleImageAltChange = (e, index) => {
    let updatedFiles = [...currentFiles];
    updatedFiles[index].alt_text = e.target.value;
    setCurrentFiles(updatedFiles)
  }

  const handleMultipleSubmit = () => {
    let imagesFormData = new FormData();
    currentFiles.forEach(x => {
      imagesFormData.append("images[]", x.file);
      imagesFormData.append("data[]", JSON.stringify(x))
    })
    API.post(`/upload_media`, imagesFormData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${imagesFormData._boundary}`,
      }
    }).then(response => {
      // debugger;
      if (response.status === 200) {
        alert(response.data.message);
        setCurrentFiles([]);
        props.refreshData();
      }
    }).catch(err => alert("Something went wrong"));
  }

  // {
  //   console.log(props.data)
  // }

  const handleSearch = ({ currentTarget: input }) => {
    if (input.value.length < 2) {
      return;
    }
    if (input.value === "") {
      setAllImages(props.data);
      return;
    }
    let filteredImages = props.data?.filter((x) =>
      x.name.includes(input.value)
    );
    setAllImages(filteredImages);
  };

  return (
    <div>
      {/* <SnackBar
        isOpen={isOpen}
        message={message}
        variant={variant}
        onClose={cancelSnackBar}
      /> */}

      <Dialog
        open={props.open}
        onClose={props.handleClose}
        maxWidth="md"
        fullWidth
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Select Images</DialogTitle>
        <DialogContent>
          {/* <Grid container spacing={2}> */}
          <div className="add-fallery-wrapper">
            <Box marginBottom={4}>
              <h6>
                If the image you are looking for is not in gallery, then add it
                here first.
              </h6>
              <DropzoneArea
                // showPreviews={true}
                dropzoneClass="dropzone-wrapper-small"
                Icon={CloudUploadOutlined}
                showAlerts={false}
                acceptedFiles={["image/*"]}
                filesLimit={15}
                showPreviewsInDropzone={false}
                showFileNamesInPreview={false}
                onDrop={handleFileDrop}
                // useChipsForPreview
                dropzoneText="Drag and Drop Images here or simply click here"
                previewGridProps={{
                  container: {
                    spacing: 1,
                    direction: "row",
                    wrap: "nowrap",
                    style: {
                      overflowX: "auto",
                      padding: "1rem",
                    },
                  },
                  item: { xs: 3 },
                }}
                // previewChipProps={}
                previewText="Selected files"
              />
            </Box>
            {/* {console.log("filesimage", currentFiles)} */}
            {currentFiles.length > 0 && (
              <Box marginBottom={4}>
                <Card>
                  <div>
                    <form type="post" encType="multipart/form-data">
                      <Grid container spacing={1} style={{ padding: "10px" }}>

                        {currentFiles?.map((x, i) => (

                          <>
                            <Grid item xs={12} sm={1}>
                              <Avatar
                                src={URL.createObjectURL(x.file)}
                                alt={x.url || ""}
                                style={{ border: "1px solid #ddd" }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={5}>
                              <TextField
                                required
                                id={`alt_text${i}`}
                                name="alt_text"
                                label="Image Alt Text"
                                value={x.alt_text}
                                variant="outlined"
                                fullWidth
                                onChange={(e) => handleImageAltChange(e, i)}
                                size="small"
                                style={{ border: "1px solid #eee" }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={5}>
                              <FormControl component="fieldset">
                                <RadioGroup
                                  aria-label="is360"
                                  row
                                  defaultChecked
                                  name="is360"
                                  value={x.is360}
                                  onChange={(e) => {
                                    setCurrentFiles(
                                      currentFiles.map((y, ind) => {
                                        if (ind === i) {
                                          return {
                                            ...y,
                                            is360: !y.is360,
                                          };
                                        } else {
                                          return y;
                                        }
                                      })
                                    );
                                  }}
                                >
                                  <FormControlLabel
                                    value={false}
                                    control={<Radio />}
                                    label="Regular/Slider"
                                  />
                                  <FormControlLabel
                                    value={true}
                                    control={<Radio />}
                                    label={
                                      <span>
                                        360<sup>o</sup> View
                                      </span>
                                    }
                                  />
                                </RadioGroup>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={1}>
                              <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() =>
                                  setCurrentFiles([
                                    ...currentFiles.filter(
                                      (z, index) => index !== i
                                    ),
                                  ])
                                }
                              >
                                <DeleteOutlined />
                              </Button>
                            </Grid>
                          </>
                        ))}

                        {currentFiles.length > 0 && (
                          <Grid item xs={12} sm={12}>
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              onClick={handleMultipleSubmit}
                              style={{
                                float: "right",
                                marginTop: "1rem",
                              }}
                            >
                              Upload New Images
                            </Button>
                          </Grid>
                        )}
                      </Grid>
                    </form>
                  </div>
                </Card>
              </Box>
            )}
          </div>
          <div className="search-bucket">
            <Label>Search Images</Label>
            <FormGroup>
              <Input type="text" onChange={handleSearch} placeholder="Search images..." />
            </FormGroup>
          </div>
          <div className="d-flex flex-wrap gallery-grid">
            {/* {
              console.log("imgDsisplay", allImages)
            } */}
            {allImages?.map((x, index) => (
              <FormControlLabel
                key={index}
                style={{ width: "25%", margin: 0 }}
                control={
                  <Checkbox
                    checked={x.checked}
                    style={{ width: "100%" }}
                    onChange={(e) =>
                      props.handleImageSelect(e, index, props.section)
                    }
                    color="primary"
                    icon={
                      <div
                        style={{
                          width: "100%",
                          height: "150px",
                          position: "relative",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "normal",
                        }}
                      >
                        <img
                          className="img-thumbnail"
                          width="100%"
                          style={{
                            height: "100%",
                            objectFit: "cover",
                          }}
                          src={x.url}
                          alt=""
                        />
                        <p
                          style={{
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                            fontSize: "12px",
                            textAlign: "center",
                            marginBottom: 0,
                            fontWeight: 500,
                            background: "rgba(0,0,0,0.4)",
                            color: "#fff",
                            padding: "0 .5rem",
                          }}
                        >
                          {x.imageKey}
                        </p>
                      </div>
                    }
                    checkedIcon={
                      <div
                        style={{
                          width: "100%",
                          height: "150px",
                          position: "relative",
                        }}
                      >
                        <img
                          className="img-thumbnail"
                          width="100%"
                          src={x.url}
                          alt=""
                          style={{
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <p
                          style={{
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                            fontSize: "12px",
                            textAlign: "center",
                            marginBottom: 0,
                            fontWeight: 500,
                            background: "rgba(0,0,0,0.4)",
                            color: "#fff",
                            padding: "0 .5rem",
                          }}
                        >
                          {x.imageKey}
                        </p>
                        <div className="img-checked"></div>
                      </div>
                    }
                    name="image"
                  />
                }
              />
            ))}
          </div>
          {/* </Grid> */}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={props.handleClose}
            variant="contained"
            color="primary"
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
