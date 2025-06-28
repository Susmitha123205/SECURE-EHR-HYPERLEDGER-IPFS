import React, { useEffect, useState } from 'react';
function Records({ role }) {
   const Records = () => {
  return <div>Records Component Loaded</div>;
};
   const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4001/api/${role}/records`, {
        headers: { Authorization: token }
      });
      const data = await res.json();
      if (data.success) setRecords(data.records);
    };
    fetchRecords();
  }, [role]);

  return (
    <div>
      <h3>Uploaded Records</h3>
      <ul>
        {records.map((rec, i) => (
          <li key={i}>
            {rec.filename} — <a href={rec.ipfsUrl} target="_blank">Open</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Records;
