import React, { useEffect, useState } from "react";

function LabDashboard() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:4001/api/lab/records", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setRecords(data))
      .catch(() => setError("Failed to fetch records"));
  }, []);

  return (
    <div className="container">
      <h2>Lab Dashboard</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {records.length === 0 && !error ? (
        <p>No lab records available</p>
      ) : (
        records.map((rec, idx) => (
          <div key={idx} className="record-box">
            <p><strong>Lab Test Assigned</strong></p>
            <p>File: {rec.filename}</p>
            <a
              href={`https://dweb.link/ipfs/${rec.cid}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              🔽 Download Test Report
            </a>
          </div>
        ))
      )}
    </div>
  );
}

export default LabDashboard;
