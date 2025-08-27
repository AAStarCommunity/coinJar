import React from 'react';

interface TestControlPanelProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  statusMessage: string;
}

const TestControlPanel: React.FC<TestControlPanelProps> = ({ isRunning, onStart, onStop, statusMessage }) => {
  return (
    <div className="card">
      <h2>Test Control</h2>
      <p>Status: {statusMessage}</p>
      <button onClick={onStart} disabled={isRunning}>
        Start Test
      </button>
      <button onClick={onStop} disabled={!isRunning}>
        Stop Test
      </button>
    </div>
  );
};

export default TestControlPanel;
