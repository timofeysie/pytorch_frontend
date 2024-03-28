import { Container, IconButton, Stack } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FolderIcon from "@mui/icons-material/Folder";
import styles from "./ImageClassification.module.css";
import { useEffect, useState, useRef } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const ImageClassification = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState([]);
  const [predictedLabel, setPredictedLabel] = useState("<select & classify>");
  const fileInputRef = useRef(null);

  /**
   * Post the selected image and set the predicted label with the result.
   * @param {*} event
   * @returns
   */
  const handleUploadImage = async (event) => {
    event.preventDefault();
    setPredictedLabel("");
    if (!selectedFile) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      const response = await axiosReq.post("/images/", formData);
      // Set the predicted label based on the response
      setPredictedLabel(response.data.predicted_label);
    } catch (error) {
      console.log(error);
    }
  };

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    setPredictedLabel("");
    setSelectedFile(e.target.files[0]);
  };

  /**
   * Create a preview as a side effect whenever selected file is changed.
   */
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleClickImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "start",
    color: theme.palette.text.secondary,
    minWidth: 300,
    width: 300,
    justifyContent: "start",
  }));

  return (
    <>
      <Stack>
        <Typography noWrap>Image Classification</Typography>

        <Container>
          <div className={styles.image_container}>
            {selectedFile ? (
              <label htmlFor="contained-button-file">
                <img
                  src={preview}
                  className={styles.preview}
                  onClick={handleClickImage}
                />
              </label>
            ) : (
              <p>Choose image</p>
            )}
          </div>
        </Container>

        <Item
          sx={{
            my: 1,
            mx: "auto",
            minWidth: "224px",
          }}
        >
          <div>Label: {predictedLabel}</div>
        </Item>

        <Item
          sx={{
            my: 1,
            mx: "auto",
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            textAlign: "start",
            maxWidth: "300px",
          }}
        >
          <label
            htmlFor="contained-button-file"
            className={styles.custom_file_upload}
          >
            <FolderIcon sx={{ color: "black" }} />
            <input
              accept="image/*"
              className={styles.input}
              id="contained-button-file"
              multiple
              type="file"
              onChange={onSelectFile}
              ref={fileInputRef}
            />
          </label>
          <Typography ml={1} sx={{ textOverflow: "ellipsis" }}>
            {selectedFile?.name}
          </Typography>
        </Item>

        <Item
          sx={{
            my: 1,
            mx: "auto",
            p: 2,
            minWidth: "224px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <IconButton sx={{ marginTop: "5px" }} onClick={handleUploadImage}>
            <CloudUploadIcon sx={{ color: "black" }} />
          </IconButton>
          <Typography>Upload & classify</Typography>
        </Item>
      </Stack>
    </>
  );
};

export default ImageClassification;
