import React, { useState } from "react";
import CvUpload from "./CvUpload";
import ResultDisplay from "./ResultDisplay";

function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="App">
      <h1>CuViQ - CV Matcher</h1>
      <CvUpload setResult={setResult} />
      {result && <ResultDisplay data={result} />}
    </div>
  );
}

export default App;
