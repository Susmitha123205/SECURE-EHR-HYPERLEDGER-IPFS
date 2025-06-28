import React, { useState } from 'react';

function Upload({ role }) {
  const [file, setFile] = useState(null);

  const upload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:4001/api/${role}/upload`, {
      method: "POST",
      headers: { Authorization: token },
      body: formData
    });

    const data = await res.json();
    if (data.success) {
      alert("Uploaded successfully!");
    } else {
      alert("Upload failed");
    }
  };

  return (
    <div>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={upload}>Upload</button>
    </div>
  );
}

export default Upload;
