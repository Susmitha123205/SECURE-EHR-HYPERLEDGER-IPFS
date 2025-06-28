import React, { useState } from "react";
import axios from "axios";

function UploadRecord() {
  const [file, setFile] = useState(null);
  const [ipfsUrl, setIpfsUrl] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Please select a file!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:4001/api/patient/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIpfsUrl(res.data.ipfsUrl);
      alert("File uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed: " + err.message);
    }
  };

  return (
    <div>
      <h2>Upload Medical Record</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <br />
      <button onClick={handleUpload}>Upload</button>
      {ipfsUrl && (
        <p>
          File uploaded to IPFS:{" "}
          <a href={ipfsUrl} target="_blank" rel="noreferrer">
            {ipfsUrl}
          </a>
        </p>
      )}
    </div>
  );
}

export default UploadRecord;
