import React, { useEffect, useState } from "react";

function InsuranceDashboard() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:4001/api/insurance/records", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setRecords(data))
      .catch(() => setError("Failed to fetch records"));
  }, []);

  return (
    <div className="container">
      <h2>Insurance Dashboard</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {records.length === 0 && !error ? (
        <p>No insurance records available</p>
      ) : (
        records.map((rec, idx) => (
          <div key={idx} className="record-box">
            <p><strong>Insurance Request</strong></p>
            <p>File: {rec.filename}</p>
            <a
              href={`https://dweb.link/ipfs/${rec.cid}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              🔽 Download Record
            </a>
          </div>
        ))
      )}
    </div>
  );
}

export default InsuranceDashboard;
