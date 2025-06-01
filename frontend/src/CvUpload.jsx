import React, { useState } from "react";

function CvUpload({ setResult }) {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("cv_file", file);

    try {
      const response = await fetch("http://localhost:8000/match_cv/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Error uploading file", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="submit">Upload CV</button>
    </form>
  );
}

export default CvUpload;
