import React, { useEffect, useState } from "react";

function PharmacyDashboard() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:4001/api/pharmacy/records", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setRecords(data))
      .catch(() => setError("Failed to fetch records"));
  }, []);

  return (
    <div className="container">
      <h2>Pharmacy Dashboard</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {records.length === 0 && !error ? (
        <p>No prescriptions available</p>
      ) : (
        records.map((rec, idx) => (
          <div key={idx} className="record-box">
            <p><strong>Prescription Issued</strong></p>
            <p>File: {rec.filename}</p>
            <a
              href={`https://dweb.link/ipfs/${rec.cid}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              🔽 Download Prescription
            </a>
          </div>
        ))
      )}
    </div>
  );
}

export default PharmacyDashboard;
