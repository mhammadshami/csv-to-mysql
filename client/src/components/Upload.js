import React, { useState } from "react";
import axios from "axios";

const Upload = () => {
  const handleClickVariant = (variant) => () => {
    // variant could be success, error, warning, info, or default
  };

  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");

  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const uploadFile = async (e) => {
    const formData = new FormData();
    formData.append("uploadfile", file);
    formData.append("uploadfile", fileName);

    axios.post("http://localhost:8000/uploadfile", formData);
  };
  return (
    <div>
      <input type="file" name="photo" accept="csv" onChange={saveFile} />
      <button onClick={uploadFile}>Upload</button>
    </div>
  );
};

export default Upload;
