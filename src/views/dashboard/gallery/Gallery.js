import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import AWS from "aws-sdk";
import S3 from "react-aws-s3";
import {
  Avatar,
  Box,
  Card,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import { DeleteRounded } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import "./Gallery.scss";
import {API} from '../../../http/API';
import { Alert } from "bootstrap";

const Gallery = () => {

  const [imagesData, setImagesData] = useState([]);

  useEffect(() => {
    API.get(`/get_all_images`)
    .then((resp) => {
      if (resp.data.status == 200) {
        setImagesData(resp.data.data);
      }
    });
  
  }, []);

  const handleImageDelete = (id) => {

    API.delete(`delete_images/${id}`)
      .then((response) => {
        let filtered = imagesData.filter( (x) => x._id !== id);
        setImagesData(filtered);
        alert('File has been deleted.');
      })
      .catch((err) => console.error(err));
  };

  return (
   
    <div className="gallery-images-wrap">

      <Box>
        <GridList cellHeight={150} className="" spacing={10}>
          {imagesData?.map((img , index) => (
            <GridListTile
              className="gallery-tile"
              cols={0.4}
              key={img + index}
            >
              <img src={img.url} alt={img.name} />
              <GridListTileBar
                title={<small>{img.name}</small>}
                // subtitle={<span>by: {tile.author}</span>}
                actionIcon={
                  <IconButton
                    aria-label={`info about`}
                    onClick={() => handleImageDelete(img._id)}
                    className=""
                  >
                    <DeleteRounded
                      fontSize="small"
                      color="secondary"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    />
                  </IconButton> 
                }
              />
            </GridListTile>
          ))}
        </GridList>
      </Box>
    </div>
  );
};

export default Gallery;
