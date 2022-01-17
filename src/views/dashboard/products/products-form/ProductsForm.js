import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Button,
  Label,
  CustomInput,
  Input,
  Col,
  UncontrolledCollapse,
} from "reactstrap";
import MultiSelect from "react-select/creatable";
// import CreatableSelect from 'react-select/creatable';

import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import "./ProductsForm.scss";
import { API } from "../../../../http/API";
import GalleryModal from "../../gallery-modal/GalleryModal";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../../assets/scss/plugins/extensions/editor.scss";
import AWS from "aws-sdk";
import S3 from "react-aws-s3";
import CKEditor from "ckeditor4-react";
import { useHistory, useParams } from "react-router-dom";
import { Row } from "react-bootstrap";
import { DeleteOutlined, RemoveCircleOutline } from "@material-ui/icons";
import "./../../../../assets/scss/plugins/forms/react-select/_react-select.scss";

const formSchema = Yup.object().shape({});

const tagsList = [
  {
    value: "3+ Months",
    label: "3+ Months",
  },
  {
    value: "BPA Free",
    label: "BPA Free",
  },
  {
    value: "Electric",
    label: "Electric",
  },
  {
    value: "Manual",
    label: "Manual",
  },
];

const arabicTagsList = [
  {
    value: "منتجاته",
    label: "منتجاته",
  },
  {
    value: "ذات صل",
    label: "ذات صل",
  },
  {
    value: "مجات ذات",
    label: "مجات ذات",
  },
  {
    value: "نتا صله",
    label: "نتا صله",
  },
];

const sortingList = [
  {
    value: "Popularity",
    label: "Popularity",
  },
  {
    value: "Recommended",
    label: "Recommended",
  },
  {
    value: "Best Seller",
    label: "Best Seller",
  },
];

const initialProducts = {
  name: "",
  arabic_name: "",
  rating: "",
  short_description: "",
  long_description: "",
  category: "",
  sub_category: "",
  featured_img: "",
  images_list: [], // (array of strings)
  banner_images_list: [],
  downloads: "",
  product_code: "",
  firstcry_link: "",
  tags: [],
  arabic_tags: [],
  sortings: [],
  features: "",
  meta_details: {
    title: "",
    description: "",
    schema_markup: "",
  },
  specifications: {
    description: "",
  },
  overview: "",
  type: "",
  status: "",
  variations: [],
  variation_images: [],
  route: "",
  single_default_images: [],
  arabic: {
    name: "",
    arabic_name: "",
    short_description: "",
    long_description: "",
    features: "",
    tags:[],
    arabic_tags: [],
    meta_details: {
      title: "",
      description: "",
      schema_markup: "",
    },
    specifications: {
      description: "",
    },
  },
};

const ProductsForm = () => {
  const history = useHistory();

  const [products, setProducts] = useState({ ...initialProducts });
  const [modalShow, setModalShow] = React.useState(false);
  const [contentModalShow, setContentModalShow] = React.useState(false);
  const [imagesData, setImagesData] = useState([]);

  const [isSingle, setIsSingle] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [isBanner, setIsBanner] = useState(false);
  const [bannerThumbnailPreview, setBannerThumbnailPreview] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [isOverview, setIsOverview] = useState(false);
  const [isFeatures, setIsFeatures] = useState(false);
  const [overviewThumbnailPreview, setOverviewThumbnailPreview] = useState("");
  const [featuresThumbnailPreview, setFeaturesThumbnailPreview] = useState("");

  //!----------------------------------Edit------------------------
  const { id } = useParams();
  const [isEdit, setIsEdit] = useState(false);

  // useEffect(() => {
  //   console.log("calling.....")
  //   if (products?.variations?.length < 1 && products?.images_list?.length > 0) {
  //     if (!isEdit) {
  //       let single_default_images = products?.images_list?.map((x) => {
  //         return {
  //           image: x,
  //           is_default: false,
  //         };
  //       });
  //       setProducts({ ...products, single_default_images });
  //     }
  //   }
  // }, [
  //   selectedImages,
  //   products?.variations,
  //   products?.images_list,
  //   isEdit,
  //   products
  // ]);

  useEffect(() => {
    if (id && id !== "") {
      setIsEdit(true);
      API.get(`/products/${id}`)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            let productData = response.data;
            setThumbnailPreview(productData?.featured_img);
            setSelectedImages(
              productData?.single_default_images?.map((x) => x.image) || []
            );
            setBannerThumbnailPreview(productData?.banner_images_list);
            setFeaturesThumbnailPreview(productData?.features);
            setOverviewThumbnailPreview(productData?.overview);
            if (!productData.arabic) {
              productData.arabic = initialProducts.arabic;
            }
            if (!productData.meta_details.schema_markup) {
              productData.meta_details.schema_markup =
                initialProducts.meta_details.schema_markup;
            }
            if (!productData.arabic.meta_details.schema_markup) {
              productData.arabic.meta_details.schema_markup =
                initialProducts.arabic.meta_details.schema_markup;
            }
            if (productData.single_default_images?.length > 0) {
              productData.images_list = productData.single_default_images?.map(
                (x) => x.image
              );
            }
            if (
              productData?.variations?.length > 0 &&
              (productData?.variation_images?.length < 1 ||
                !productData?.variation_images)
            ) {
              productData.variation_images = productData?.images_list?.map(
                (x) => {
                  return {
                    image: x,
                    variation: "",
                    is_default: false,
                  };
                }
              );
            }
            if (
              productData?.variations?.length > 0 &&
              productData?.variation_images?.length > 0 &&
              !productData?.variation_images?.find(
                (x) => x.variation?.includes("")?.image
              )
            ) {
              productData.variation_images = productData?.variation_images?.map(
                (x, index) => {
                  return {
                    image: x.image,
                    variation: x.variation,
                    is_default: x.is_default || false,
                  };
                }
              );
            }
            if (
              !productData?.variations?.length > 0 &&
              !productData?.single_default_images &&
              productData?.images_list?.length > 0
            ) {
              productData.single_default_images = productData?.images_list?.map(
                (x) => {
                  return {
                    image: x,
                    is_default: false,
                  };
                }
              );
              setSelectedImages(
                productData.single_default_images?.map((x) => x.image)
              );
            }
            if (
              !productData?.variations?.length > 0 &&
              productData.single_default_images?.length > 0
            ) {
              productData.single_default_images = productData?.images_list?.map(
                (x, ind) => {
                  return {
                    image: x,
                    is_default:
                      productData.single_default_images[ind]?.is_default,
                  };
                }
              );
              setSelectedImages(
                productData.single_default_images?.map((x) => x.image)
              );
            }
            setProducts(productData);
          }
        })
        .catch((err) => {
          alert(
            "Something went wrong while fetching product info, please reload the app or contact support."
          );
          console.log("some thing went wrong", err);
        });
    }
  }, []);
  //!---------------------------Category---------------
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/categories")
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          setData(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //Select category field
  const handleCategorySelect = (e) => {
    let updateValues = { ...products };
    updateValues[e.target.name] = e.target.value;
    setProducts(updateValues);
  };

  //Select subcategory field
  const handleSubCategorySelect = (e) => {
    let updateValues = { ...products };
    updateValues[e.target.name] = e.target.value;
    setProducts(updateValues);
  };

  const handleTagSelect = (tags) => {
    let updateValues = { ...products };
    updateValues.tags = tags?.map((x) => x.value || []);
    setProducts(updateValues);
  };

  const handleArabicTagSelect = (tags) => {
    let updateValues = { ...products };
    updateValues.arabic_tags = tags?.map((x) => x.value || []);
    setProducts(updateValues);
  };

  const handleSortingSelect = (sortings) => {
    let updateValues = { ...products };
    updateValues.sortings = sortings?.map((x) => x.value || []);
    setProducts(updateValues);
  };

  const handleVariationSortingSelect = (sortings, index) => {
    let updateValues = { ...products };
    updateValues.variations[index].sortings = sortings?.map(
      (x) => x.value || []
    );
    setProducts(updateValues);
  };

  const handleVariationArabicSortingSelect = (sortings, index) => {
    let updateValues = { ...products };
    updateValues.variations[index].arabic_sortings = sortings?.map(
      (x) => x.value || []
    );
    setProducts(updateValues);
  };
  //!--------------------------

  AWS.config.region = "eu-central-1"; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "eu-central-1:8db4219e-3012-4027-ac2e-60ec65e9ca84",
  });

  useEffect(() => {
    viewAlbum("album1");
  }, []);

  var albumBucketName = "pigeon-gallery";
  var s3 = new AWS.S3({
    apiVersion: "2011-12-05",
    params: { Bucket: albumBucketName },
  });

  function viewAlbum(albumName) {
    var albumPhotosKey = encodeURIComponent(albumName) + "/";
    let imagesHTMLList = s3.listObjects(
      { Prefix: albumPhotosKey },
      function (err, data) {
        if (err) {
          return alert("There was an error viewing your album: " + err.message);
        }
        // 'this' references the AWS.Request instance that represents the response
        var href = this.request.httpRequest.endpoint.href;
        var bucketUrl = href + albumBucketName + "/";

        var photos = data.Contents.map(function (photo) {
          var photoKey = photo.Key;
          var date = photo.LastModified;
          var photoUrl = bucketUrl + encodeURIComponent(photoKey);
          return {
            image: photoUrl,
            date,
            imageKey: photoKey?.split("album1/")?.[1]?.split(".")?.[0],
          };
        });

        setImagesData(
          photos
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .map((x) => ({ ...x, avatar: x.image, isChecked: false }))
        );
      }
    );
  }

  //!--Select Image From Gallery

  const handleImageSelect = (e, index) => {
    if (e.target.checked) {
      if (isSingle && !isBanner) {
        setProducts({
          ...products,
          featured_img: imagesData[index].avatar,
        });
        setThumbnailPreview(imagesData[index].avatar);
        setTimeout(() => {
          setModalShow(false);
        }, 500);
      } else if (!isSingle && isBanner) {
        setProducts({
          ...products,
          banner_images_list: [imagesData[index].avatar],
        });
        setBannerThumbnailPreview(imagesData[index].avatar);
        setTimeout(() => {
          setModalShow(false);
        }, 500);
      } else {
        setSelectedImages([...selectedImages, imagesData[index].avatar]);
        if (products?.variations?.length < 1) {
          setProducts({
            ...products,
            images_list: [...products.images_list, imagesData[index].avatar],
            variation_images: [
              ...products.variation_images,
              { image: imagesData[index].avatar, variation: "" },
            ],
            single_default_images: [
              ...products.single_default_images,
              { image: imagesData[index].avatar, is_default: false },
            ],
          });
        } else {
          setProducts({
            ...products,
            images_list: [...products.images_list, imagesData[index].avatar],
            variation_images: [
              ...products.variation_images,
              { image: imagesData[index].avatar, variation: "" },
            ],
          });
        }
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
      // }
    } else {
      if (isSingle && !isBanner) {
        setProducts({ ...products, thumbnail: "" });
        setThumbnailPreview("");
      } else if (!isSingle && isBanner) {
        setProducts({ ...products, banner_img: "" });
        setBannerThumbnailPreview("");
      } else {
        setSelectedImages(
          selectedImages.filter((x) => x !== imagesData[index].avatar)
        );
      }
      setImagesData(
        imagesData.map((x, i) => {
          if (i === index) {
            return {
              ...x,
              isChecked: false,
            };
          } else {
            return x;
          }
        })
      );
    }
  };

  const handleContentImageSelect = (e, index) => {
    if (e.target.checked) {
      if (isOverview && !isFeatures) {
        setProducts({
          ...products,
          overview: imagesData[index].avatar,
        });
        setOverviewThumbnailPreview(imagesData[index].avatar);
        setTimeout(() => {
          setContentModalShow(false);
        }, 500);
      } else if (!isOverview && isFeatures) {
        setProducts({
          ...products,
          features: imagesData[index].avatar,
        });
        setFeaturesThumbnailPreview(imagesData[index].avatar);
        setTimeout(() => {
          setContentModalShow(false);
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
      // }
    } else {
      if (isOverview && !isFeatures) {
        setProducts({ ...products, overview: "" });
        setOverviewThumbnailPreview("");
      } else if (!isOverview && isFeatures) {
        setProducts({ ...products, features: "" });
        setFeaturesThumbnailPreview("");
      }
      setImagesData(
        imagesData.map((x, i) => {
          if (i === index) {
            return {
              ...x,
              isChecked: false,
            };
          } else {
            return x;
          }
        })
      );
    }
  };

  //Hanle Meta Details
  const handleMetaDetials = (e) => {
    let updateFields = { ...products };
    updateFields.meta_details[e.target.name] = e.target.value;
    setProducts(updateFields);
  };

  //Handle Input Fields
  const handleInput = (e) => {
    let updateValues = { ...products };
    updateValues[e.target.name] = e.target.value;
    setProducts(updateValues);
  };

  //! variation changes
  const handleVariationChange = (e, index) => {
    let updatedProducts = { ...products };
    updatedProducts.variations[index][e.target.name] = e.target.value;
    setProducts(updatedProducts);
  };

  const handleVariationImageChange = (e, index, image) => {
    let updatedProducts = { ...products };
    updatedProducts.variation_images[index].variation = e.target.value;
    updatedProducts.variation_images[index].image = image;
    setProducts(updatedProducts);
  };

  const handleVariationDefaultChange = (e, index, image) => {
    let updatedProducts = { ...products };

    updatedProducts.variation_images[index].is_default = e.target.checked;
    setProducts(updatedProducts);
  };
  const handleSingleDefaultChange = (e, index) => {
    let updatedProducts = { ...products };

    updatedProducts.single_default_images[index].is_default = e.target.checked;
    setProducts(updatedProducts);
  };

  const addVariation = () => {
    let updatedProducts = { ...products };
    updatedProducts.variations.push({
      name: "",
      arabic_name: "",
      code: "",
      link: "",
      sortings: [],
      arabic_sortings: []
    });
    setProducts(updatedProducts);
  };

  const removeVariation = (index) => {
    let updatedProducts = { ...products };
    let updatedVariations = updatedProducts.variations.filter(
      (x, i) => i !== index
    );
    updatedProducts.variations = updatedVariations;
    setProducts(updatedProducts);
  };

  const handleDownloadsUpload = (event) => {
    let downloadFile = event.target.files[0];

    const config = {
      bucketName: "pigeon-gallery",
      dirName: "downloads",
      region: "eu-central-1",
      accessKeyId: "AKIA3NKPVIWSTWXS7QGQ",
      secretAccessKey: "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",
    };
    const ReactS3Client = new S3(config);
    ReactS3Client.uploadFile(
      downloadFile,
      downloadFile.name || new Date().toTimeString()
    ).then((data) => {
      if (data.status === 204) {
        let updatedProducts = { ...products };
        updatedProducts.downloads = data.location;
        setProducts(updatedProducts);
        console.log("success");
      } else {
        console.log("fail");
      }
    });
  };

  // ARABIC VERSION HANDLERS

  //Hanle Meta Details
  const handleArabicMetaDetials = (e) => {
    let updateFields = { ...products };
    updateFields.arabic.meta_details[e.target.name] = e.target.value;
    setProducts(updateFields);
  };

  const handleArabicTags = (tags) => {
    let updateFields = { ...products };
    updateFields.arabic.tags = tags?.map((x) => x.value || []);
    //updateFields.arabic.tags[e.target.name] = e.target.value;
    setProducts(updateFields);
  };

  const handleArabicTagsList = (tags) => {
    let updateFields = { ...products };
    updateFields.arabic.arabic_tags = tags?.map((x) => x.value || []);
    //updateFields.arabic.tags[e.target.name] = e.target.value;
    setProducts(updateFields);
  };

  //Handle Input Fields
  const handleArabicInput = (e) => {
    let updateValues = { ...products };
    updateValues.arabic[e.target.name] = e.target.value;
    setProducts(updateValues);
  };

  //!---------handle submit-------------
  const handleSubmit = () => {
    if (products.name === "") {
      alert("Please Enter Product Name");
      return;
    }
    let submitProducts = { ...products };
    if (!submitProducts.variations?.length > 0) {
      submitProducts.variation_images = [];
    }

    if (isEdit) {
      let updateId = submitProducts.route;
      delete submitProducts["_id"];
      API.put(`/products/${updateId}`, submitProducts)
        .then((response) => {
          alert("Product updated successfully");
          history.push("/products/list");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      API.post("/products", submitProducts)
        .then((response) => {
          alert("Product has been added successfully");
          setProducts({ ...initialProducts });
          history.push("/products/list");
        })
        .catch((err) => {
          alert("Something went wrong.");
          console.log(err);
        });
    }
  };

  return (
    <div
      className="cards-wrapper-product"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <Card className="product-form-wrap">
        <CardHeader>
          <CardTitle>{isEdit ? "Edit" : "Add"} Product Form</CardTitle>
        </CardHeader>
        <CardBody>
          <Formik
            initialValues={{
              required: "",
              email: "",
              url: "",
              number: "",
              date: "",
              minlength: "",
              maxlength: "",
            }}
            validationSchema={formSchema}
          >
            {({ errors, touched }) => (
              <Form>
                <FormGroup className="">
                  <Label for="name">Name</Label>
                  <Field
                    name="name"
                    id="name"
                    onChange={handleInput}
                    value={products.name}
                    className={`form-control`}
                  />
                </FormGroup>
                <FormGroup className="">
                  <Label for="route">Route</Label>
                  <Field
                    name="route"
                    id="route"
                    onChange={handleInput}
                    value={products.route}
                    className={`form-control`}
                    disabled = {(isEdit) ? "disabled" : ""}
                  />
                </FormGroup>
                <FormGroup className="my-2">
                  <Label for="product_code">Product Code</Label>
                  <Field
                    name="product_code"
                    id="product_code"
                    onChange={handleInput}
                    value={products.product_code}
                    className={`form-control`}
                  />
                </FormGroup>
                <FormGroup className="my-2">
                  <Label for="product_code">FirstCry Link</Label>
                  <Field
                    name="firstcry_link"
                    id="firstcry_link"
                    onChange={handleInput}
                    value={products.firstcry_link}
                    className={`form-control`}
                  />
                </FormGroup>
                <FormGroup className="my-2">
                  <Label for="rating">Rating</Label>
                  <Field
                    name="rating"
                    id="rating"
                    onChange={handleInput}
                    value={products.rating}
                    className={`form-control`}
                  />
                </FormGroup>
                <div className="mb-2">
                  <Label>Variations</Label>
                  <div className="clearfix mb-1" />
                  {products?.variations?.map((x, ind) => (
                    <div className="variation-row-wrapper mb-2">
                      <Row>
                        <Col sm={4}>
                          <Field
                            name={`name`}
                            id={`variation_name_${ind}`}
                            onChange={(e) => handleVariationChange(e, ind)}
                            value={x.name}
                            placeholder={"Name"}
                            className={`form-control`}
                          />
                        </Col>
                        <Col sm={4}>
                          <Field
                            name={`arabic_name`}
                            id={`variation_name_${ind}`}
                            onChange={(e) => handleVariationChange(e, ind)}
                            value={x.arabic_name}
                            placeholder={"arabic name"}
                            className={`form-control`}
                          />
                        </Col>
                        <Col sm={2}>
                          <Field
                            name={`code`}
                            id={`variation_code_${ind}`}
                            onChange={(e) => handleVariationChange(e, ind)}
                            value={x.code}
                            placeholder={"Code"}
                            className={`form-control`}
                          />
                        </Col>
                        <Col sm={5}>
                          <Field
                            name={`link`}
                            id={`variation_link_${ind}`}
                            onChange={(e) => handleVariationChange(e, ind)}
                            value={x.link}
                            placeholder={"First Cry Link"}
                            className={`form-control`}
                          />
                        </Col>
                        <Col sm={1}>
                          <div
                            style={{ height: "100%" }}
                            className="d-flex align-items-center"
                          >
                            <DeleteOutlined
                              color="secondary"
                              onClick={() => removeVariation(ind)}
                            />
                          </div>
                        </Col>
                        <Col sm={11}>
                          <FormGroup>
                            {/* <Label for="sorting">Variation Tags</Label> */}
                            <MultiSelect
                              isMulti
                              options={tagsList}
                              placeholder="Select Tags"
                              className="variation-tags"
                              onChange={(e) =>
                                handleVariationSortingSelect(e, ind)
                              }
                              value={x?.sortings?.map((x) => {
                                return {
                                  value: x,
                                  label: x,
                                };
                              })}
                            />
                          </FormGroup>
                        </Col>
                        <Col sm={11}>
                          <FormGroup>
                          <Label for="sorting">Arabic Tags</Label>
                            <MultiSelect
                              isMulti
                              options={arabicTagsList}
                              placeholder="Select Tags"
                              className="variation-tags"
                              onChange={(e) =>
                                handleVariationArabicSortingSelect(e, ind)
                              }
                              value={x?.arabic_sortings?.map((x) => {
                                return {
                                  value: x,
                                  label: x,
                                };
                              })}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <Button.Ripple
                    onClick={addVariation}
                    color="danger"
                    type="button"
                    className="mt-0"
                    size="sm"
                  >
                    Add Variation
                  </Button.Ripple>
                </div>

                <FormGroup>
                  <Label for="category">Select Category</Label>
                  <CustomInput
                    type="select"
                    name="category"
                    id="category"
                    value={products.category}
                    onChange={handleCategorySelect}
                  >
                    <option value="all">Select Category</option>
                    {data?.map((x) => (
                      <React.Fragment key={x._id}>
                        {x.parent_id === null && (
                          <option value={x._id}>{x.name}</option>
                        )}
                      </React.Fragment>
                    ))}
                  </CustomInput>
                </FormGroup>
                <FormGroup>
                  <Label for="sub_category">Select Sub-Category</Label>
                  <CustomInput
                    type="select"
                    name="sub_category"
                    id="sub_category"
                    value={products.sub_category}
                    onChange={handleSubCategorySelect}
                  >
                    <option value={"all"}>Select Subcategory</option>
                    {data
                      ?.filter((c) => c.parent_id === products.category)
                      ?.map((x) => (
                        <React.Fragment key={x._id}>
                          {x.parent_id && (
                            <option value={x._id}>{x.name}</option>
                          )}
                        </React.Fragment>
                      ))}
                  </CustomInput>
                </FormGroup>
                <FormGroup>
                  <Label for="tags">Tags</Label>
                  <MultiSelect
                    isMulti
                    options={tagsList}
                    onChange={handleTagSelect}
                    value={products.tags?.map((x) => {
                      return {
                        value: x,
                        label: x,
                      };
                    })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="tags">Arabic Tags</Label>
                  <MultiSelect
                    isMulti
                    options={arabicTagsList}
                    onChange={handleArabicTagSelect}
                    value={products.arabic_tags?.map((x) => {
                      return {
                        value: x,
                        label: x,
                      };
                    })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="sorting">Sorting Filters</Label>
                  <MultiSelect
                    isMulti
                    options={sortingList}
                    onChange={handleSortingSelect}
                    value={products.sortings?.map((x) => {
                      return {
                        value: x,
                        label: x,
                      };
                    })}
                  />
                </FormGroup>

                {/* //!---------------Upload Images-------------------------- */}

                <Card className="inner-card-wrap">
                  <CardHeader>
                    <CardTitle>Add Product Information</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col sm={6}>
                        <FormGroup className="my-2">
                          <Label for="featured_img">Featured Image</Label>
                          <div className="clearfix" />
                          <div className="img-preview-wrapper">
                            {thumbnailPreview !== "" && (
                              <img src={thumbnailPreview} alt="" />
                            )}
                          </div>
                          <Button.Ripple
                            color="primary"
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
                      <Col sm={6}>
                        <FormGroup className="my-2">
                          <Label for="banner_images_list">Banner Images</Label>
                          <div className="clearfix" />
                          <div className="img-preview-wrapper">
                            {bannerThumbnailPreview !== "" && (
                              <img src={bannerThumbnailPreview} alt="" />
                            )}
                          </div>
                          <Button.Ripple
                            color="primary"
                            onClick={() => {
                              setIsSingle(false);
                              setIsBanner(true);
                              setModalShow(true);
                            }}
                          >
                            Add Banner Image
                          </Button.Ripple>
                        </FormGroup>
                      </Col>
                    </Row>

                    {/* Images List */}
                    <FormGroup className="my-2">
                      <Label for="images_list">Slider Images</Label>
                      <div className="clearfix" />

                      <Button.Ripple
                        color="primary"
                        onClick={() => {
                          setIsSingle(false);
                          setIsBanner(false);
                          setModalShow(true);
                        }}
                      >
                        Add Slider Images
                      </Button.Ripple>
                    </FormGroup>
                    <Row>
                      {selectedImages?.map((x, index) => (
                        <Col sm={3} key={index}>
                          <div className="img-preview-wrapper preview-small">
                            <RemoveCircleOutline
                              className="remove-icon"
                              color="secondary"
                              onClick={() => {
                                setSelectedImages(
                                  selectedImages.filter(
                                    (y, ind) => ind != index
                                  )
                                );
                                setProducts({
                                  ...products,
                                  images_list: products.images_list.filter(
                                    (y, ind) => ind != index
                                  ),
                                  variation_images: products.variation_images.filter(
                                    (y, ind) => ind != index
                                  ),
                                  single_default_images: products.single_default_images.filter(
                                    (y, ind) => ind != index
                                  ),
                                });
                              }}
                            />
                            <img src={x} alt="" />
                            <FormGroup
                              check
                              style={
                                {
                                  // height: "100%",
                                  // display: "flex",
                                  // // flexDirection: "column",
                                  // alignItems: "center",
                                  // justifyContent: "center",
                                  // marginTop: "10px",
                                }
                              }
                            >
                              <Label check>
                                <Input
                                  type="checkbox"
                                  name="is_default"
                                  id={`is_default_s_${index}`}
                                  checked={
                                    products.single_default_images?.[index]
                                      ?.is_default
                                  }
                                  onChange={(e) =>
                                    handleSingleDefaultChange(e, index, x)
                                  }
                                />
                                Default/First Image ?
                              </Label>
                            </FormGroup>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </CardBody>
                </Card>

                {/* //!------------------------------------------------------------ */}

                <FormGroup className="my-2">
                  <Label for="downloads">Downloads</Label>
                  <CustomInput
                    type="file"
                    id="downloads"
                    name="downloads"
                    onChange={handleDownloadsUpload}
                    className={`form-control`}
                  />

                  <p className="mt-2 font-weight-bold">
                    Current Download File:{" "}
                    {products.downloads ? (
                      <a href={products.downloads}>{products.downloads}</a>
                    ) : (
                      "None selected"
                    )}
                  </p>
                </FormGroup>
                {/* ----------------------------- */}
                <div>
                  <Label for="short_description">Short Description</Label>
                  <CKEditor
                    onBeforeLoad={(CKEDITOR) =>
                      (CKEDITOR.disableAutoInline = true)
                    }
                    data={products.short_description}
                    onChange={(e) =>
                      setProducts({
                        ...products,
                        short_description: e.editor.getData(),
                      })
                    }
                  />
                </div>
                <div>
                  <Label for="long_description">Long Description</Label>
                  <CKEditor
                    onBeforeLoad={(CKEDITOR) =>
                      (CKEDITOR.disableAutoInline = true)
                    }
                    data={products.long_description}
                    onChange={(e) =>
                      setProducts({
                        ...products,
                        long_description: e.editor.getData(),
                      })
                    }
                  />
                </div>
                <div>
                  <Label for="specifications">Specifications</Label>
                  <CKEditor
                    onBeforeLoad={(CKEDITOR) =>
                      (CKEDITOR.disableAutoInline = true)
                    }
                    data={products.specifications?.description || ""}
                    onChange={(e) =>
                      setProducts({
                        ...products,
                        specifications: {
                          ...products.specifications,
                          description: e.editor.getData(),
                        },
                      })
                    }
                  />
                </div>

                <Row>
                  <Col sm={6}>
                    <FormGroup className="my-2">
                      <Label for="featured_img">Overview Content Image</Label>
                      <div className="clearfix" />
                      <div className="img-preview-wrapper">
                        {overviewThumbnailPreview !== "" && (
                          <img src={overviewThumbnailPreview} alt="" />
                        )}
                      </div>
                      <Button.Ripple
                        color="primary"
                        onClick={() => {
                          setIsOverview(true);
                          setIsFeatures(false);
                          setContentModalShow(true);
                        }}
                      >
                        Add Overview Image
                      </Button.Ripple>
                    </FormGroup>
                  </Col>
                  <Col sm={6}>
                    <FormGroup className="my-2">
                      <Label for="banner_images_list">
                        Features Content Image
                      </Label>
                      <div className="clearfix" />
                      <div className="img-preview-wrapper">
                        {featuresThumbnailPreview !== "" && (
                          <img src={featuresThumbnailPreview} alt="" />
                        )}
                      </div>
                      <Button.Ripple
                        color="primary"
                        onClick={() => {
                          setIsOverview(false);
                          setIsFeatures(true);
                          setContentModalShow(true);
                        }}
                      >
                        Add Features Image
                      </Button.Ripple>
                    </FormGroup>
                  </Col>
                </Row>

                {/* //!-----------------------Meta Tag Details----------------------------------- */}
                <Card className="inner-card-wrap">
                  <CardHeader>
                    <CardTitle>Meta Tag Details</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <FormGroup className="my-2">
                      <Label for="title" className="mb-1">
                        Meta Title
                      </Label>
                      <Field
                        name="title"
                        id="title"
                        onChange={handleMetaDetials}
                        value={products.meta_details?.title || ""}
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
                        onChange={handleMetaDetials}
                        value={products.meta_details?.description}
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
                        onChange={handleMetaDetials}
                        value={products.meta_details?.schema_markup}
                      />
                    </div>
                  </CardBody>
                </Card>
                {/* //!----------Variation Images Section--------------- */}
                {products.images_list?.length > 0 &&
                  products?.variations?.length > 0 && (
                    <Card className="inner-card-wrap">
                      <CardHeader>
                        <CardTitle>Select Variation Images</CardTitle>
                      </CardHeader>
                      <CardBody>
                        {products.images_list?.map((x, index) => (
                          <Row>
                            <Col sm={4}>
                              <div style={{ width: "100%" }}>
                                <img
                                  src={x}
                                  alt=""
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                  }}
                                />
                              </div>
                            </Col>
                            <Col sm={4}>
                              <FormGroup
                                style={{
                                  height: "100%",
                                  display: "flex",
                                  flexDirection: "column",
                                  // alignItems:'center',
                                  justifyContent: "center",
                                }}
                              >
                                <Label for="variation_type">
                                  Select Variation
                                </Label>
                                <CustomInput
                                  type="select"
                                  name="variation_type"
                                  id={`variation_type_${index}`}
                                  value={
                                    products.variation_images?.[index]
                                      ?.variation
                                  }
                                  onChange={(e) =>
                                    handleVariationImageChange(e, index, x)
                                  }
                                >
                                  <option value="all">Select Variation</option>
                                  {products.variations?.map((x) => (
                                    <React.Fragment key={x._id}>
                                      {<option value={x.name}>{x.name}</option>}
                                    </React.Fragment>
                                  ))}
                                </CustomInput>
                              </FormGroup>
                            </Col>
                            <Col sm={4}>
                              <FormGroup
                                check
                                style={{
                                  height: "100%",
                                  display: "flex",
                                  // flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  marginTop: "10px",
                                }}
                              >
                                <Label check>
                                  <Input
                                    type="checkbox"
                                    name="is_default"
                                    id={`is_default_${index}`}
                                    checked={
                                      products.variation_images?.[index]
                                        ?.is_default
                                    }
                                    onChange={(e) =>
                                      handleVariationDefaultChange(e, index, x)
                                    }
                                  />
                                  Default/First Image ?
                                </Label>
                              </FormGroup>
                            </Col>
                          </Row>
                        ))}
                      </CardBody>
                    </Card>
                  )}

                {/* //!----------Submit Button--------------- */}
                {/* <Button.Ripple
                  onClick={handleSubmit}
                  color="primary"
                  type="submit"
                >
                  {isEdit ? "Update" : "Add"}
                </Button.Ripple> */}
              </Form>
            )}
          </Formik>
        </CardBody>
        <GalleryModal
          open={modalShow}
          handleClose={() => setModalShow(false)}
          handleImageSelect={handleImageSelect}
          data={imagesData}
          refreshData={() => viewAlbum("album1")}
        />
        <GalleryModal
          open={contentModalShow}
          handleClose={() => setContentModalShow(false)}
          handleImageSelect={handleContentImageSelect}
          data={imagesData}
          refreshData={() => viewAlbum("album1")}
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
                  url: "",
                  number: "",
                  date: "",
                  minlength: "",
                  maxlength: "",
                }}
                validationSchema={formSchema}
              >
                {({ errors, touched }) => (
                  <Form>
                    <FormGroup className="">
                      <Label for="name">Name</Label>
                      <Field
                        name="name"
                        id="name-arabic"
                        onChange={handleArabicInput}
                        value={products.arabic?.name || ""}
                        className={`form-control`}
                      />
                    </FormGroup>
                    <FormGroup>
                  <Label for="tags">Tags</Label>
                  <MultiSelect
                    isMulti
                    options={tagsList}
                    onChange={handleArabicTags}
                    value={products.arabic.tags?.map((x) => {
                      return {
                        value: x,
                        label: x,
                      };
                    })}
                  />
                  <Label for="tags">Arabic Tags</Label>
                  <MultiSelect
                    isMulti
                    options={arabicTagsList}
                    onChange={handleArabicTagsList}
                    value={products.arabic.arabic_tags?.map((x) => {
                      return {
                        value: x,
                        label: x,
                      };
                    })}
                  />
                </FormGroup>
                    <div>
                      <Label for="short_description">Short Description</Label>
                      <CKEditor
                        onBeforeLoad={(CKEDITOR) =>
                          (CKEDITOR.disableAutoInline = true)
                        }
                        data={products.arabic?.short_description || "<p></p>"}
                        onChange={(e) =>
                          setProducts({
                            ...products,
                            arabic: {
                              ...products.arabic,
                              short_description: e.editor.getData(),
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label for="long_description">Long Description</Label>
                      <CKEditor
                        onBeforeLoad={(CKEDITOR) =>
                          (CKEDITOR.disableAutoInline = true)
                        }
                        data={products.arabic?.long_description || "<p></p>"}
                        onChange={(e) =>
                          setProducts({
                            ...products,
                            arabic: {
                              ...products.arabic,
                              long_description: e.editor.getData(),
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label for="specifications">Specifications</Label>
                      <CKEditor
                        onBeforeLoad={(CKEDITOR) =>
                          (CKEDITOR.disableAutoInline = true)
                        }
                        data={
                          products.arabic?.specifications?.description ||
                          "<p></p>"
                        }
                        onChange={(e) =>
                          setProducts({
                            ...products,
                            arabic: {
                              ...products.arabic,
                              specifications: {
                                ...products.arabic?.specifications,
                                description: e.editor.getData(),
                              },
                            },
                          })
                        }
                      />
                    </div>
                    {/* //!-----------------------Meta Tag Details----------------------------------- */}
                    <Card className="inner-card-wrap">
                      <CardHeader>
                        <CardTitle>Meta Tag Details</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <FormGroup className="my-2">
                          <Label for="title" className="mb-1">
                            Meta Title
                          </Label>
                          <Field
                            name="title"
                            id="title"
                            onChange={handleArabicMetaDetials}
                            value={products.arabic?.meta_details?.title || ""}
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
                            onChange={handleArabicMetaDetials}
                            value={
                              products.arabic?.meta_details?.description || ""
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
                            onChange={handleArabicMetaDetials}
                            value={
                              products.arabic?.meta_details?.schema_markup || ""
                            }
                          />
                        </div>
                      </CardBody>
                    </Card>
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
          <Button.Ripple onClick={handleSubmit} color="primary" type="submit">
            {isEdit ? "Update" : "Add"}
          </Button.Ripple>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProductsForm;
