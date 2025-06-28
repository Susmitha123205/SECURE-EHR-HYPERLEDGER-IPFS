import React, { useEffect, useState } from "react";
import axios from "axios";

function ViewRecords() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4001/api/patient/records")
      .then(res => setRecords(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Patient Records</h2>
      {records.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <ul>
          {records.map((rec, index) => (
            <li key={index}>
              <a href={rec.ipfsUrl} target="_blank" rel="noreferrer">
                Record {index + 1}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ViewRecords;
