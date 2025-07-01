import React, { useEffect, useState } from "react";

function DoctorDashboard() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:4001/api/records", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setRecords(data))
      .catch(() => setError("Failed to fetch records"));
  }, []);
const handleDeleteAll = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:4001/api/records", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  alert(data.message);
  setRecords([]); // ✅ clear UI after delete

};
const role = localStorage.getItem("role");

  return (
  <div className="container">
    <h2>🩺 Doctor Dashboard</h2>
    <img src="/assets/doctor-male.png" alt="Doctor" width="120" />

    <button
      onClick={handleDeleteAll}
      style={{
        margin: "1rem 0",
        padding: "10px",
        background: "red",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      🗑️ Delete All Reports
    </button>

    {error && <p style={{ color: "red" }}>{error}</p>}
    {records.length === 0 ? (
      <p>No reports available.</p>
    ) : (
      records.map((rec, idx) => (
        <div key={idx} className="record-box">
          <p>
  <strong>
    {role === "doctor" && "📋 Prescription:"}
    {role === "lab" && "🧪 Test Report:"}
    {role === "pharmacy" && "💊 Dispensation Note:"}
    {role === "insurance" && "🏥 Claim Summary:"}
  </strong> {rec.filename}
</p>

          <a
            href={`http://localhost:4001/uploads/${rec.filename}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: "5px",
              fontWeight: "bold",
              color: "#0077cc",
            }}
          >
            🔽 Download Prescription
          </a>
        </div>
      ))
    )}
  </div>
);
}
export default DoctorDashboard;
