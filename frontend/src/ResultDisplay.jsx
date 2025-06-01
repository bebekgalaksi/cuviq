import React from "react";

function ResultDisplay({ data }) {
  return (
    <div>
      <h2>Parsed CV</h2>
      <p><strong>Description:</strong> {data.parsed_sections.description}</p>
      <p><strong>Skills:</strong> {data.parsed_sections.skills}</p>
      <p><strong>Education and Experience:</strong> {data.parsed_sections.education_and_experience}</p>

      <h2>Top Job Matches</h2>
      <ul>
        {data.top_matches.map((job, index) => (
          <li key={index}>
            <strong>{job.job_title}</strong><br />
            {job.job_description}...<br />
            Match: {job.match_percentage}%
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ResultDisplay;
