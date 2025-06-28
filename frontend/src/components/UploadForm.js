// File structure:
// src/components/
// ├── UploadForm.js
// ├── PatientDashboard.js
// ├── DoctorDashboard.js
// ├── LabDashboard.js
// ├── PharmacyDashboard.js
// └── InsuranceDashboard.js

// UploadForm.js
// src/components/UploadForm.js
// src/components/UploadForm.js
// frontend/src/components/UploadForm.js
import React, { useState } from "react";
import axios from "axios";

function UploadForm({ role }) {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:4001/api/patient/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setResponse(res.data);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      alert("Upload error");
      console.error(err);
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>

      {response?.ipfsUrl && (
        <div>
          <p>✅ Uploaded to IPFS</p>
          <a href={response.ipfsUrl} target="_blank" rel="noreferrer">🔗 View File</a>
        </div>
      )}
    </div>
  );
}

export default UploadForm;
