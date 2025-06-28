import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:4001/api/patient/upload", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setResponse(res.data);
        setErrorMessage(null); // Clear any previous errors
      } else {
        setErrorMessage(res.data.message || "Upload failed");
      }
    } catch (error) {
      setErrorMessage("Upload failed due to an error. Please try again.");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Upload Medical Record</h2>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      {errorMessage && <div style={{ color: 'red' }}><strong>{errorMessage}</strong></div>}
      {response && (
        <div>
          <p>✅ Uploaded to IPFS!</p>
          <a href={response.ipfsUrl} target="_blank" rel="noreferrer">View File</a>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
