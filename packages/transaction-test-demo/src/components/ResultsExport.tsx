import React from 'react';

interface ResultsExportProps {
  onExportJson: () => void;
  onExportCsv: () => void;
}

const ResultsExport: React.FC<ResultsExportProps> = ({ onExportJson, onExportCsv }) => {
  return (
    <div className="card">
      <h2>Results Export</h2>
      <button onClick={onExportJson}>Export JSON</button>
      <button onClick={onExportCsv}>Export CSV</button>
    </div>
  );
};

export default ResultsExport;
