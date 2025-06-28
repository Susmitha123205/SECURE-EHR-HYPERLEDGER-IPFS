import React, { useState } from "react";

function PatientDashboard() {
  const [file, setFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadSuccess(false);
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in. Please login again.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:4001/api/upload/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,  // Correct token header
          // Note: Do NOT set Content-Type manually for FormData
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setUploadSuccess(true);
        setError("");
        setFile(null);
      } else {
        setError(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Server error during upload");
    }
  };

  return (
    <div className="container">
      <h2>Patient Dashboard - Upload Medical Record</h2>
      <img src="/assets/patient-oxygen-mask.png" alt="patient" width="80" />

      {uploadSuccess && <p style={{ color: "green" }}>Upload successful!</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default PatientDashboard;
