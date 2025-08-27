import React, { useState } from 'react';

interface TestEnvironmentSetupProps {
  onSave: (config: { bundlerUrl: string; paymasterUrl: string }) => void;
  initialConfig: { bundlerUrl: string; paymasterUrl: string };
}

const TestEnvironmentSetup: React.FC<TestEnvironmentSetupProps> = ({ onSave, initialConfig }) => {
  const [bundlerUrl, setBundlerUrl] = useState(initialConfig.bundlerUrl);
  const [paymasterUrl, setPaymasterUrl] = useState(initialConfig.paymasterUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ bundlerUrl, paymasterUrl });
  };

  return (
    <div className="card">
      <h2>Test Environment Setup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="bundlerUrl">Bundler URL:</label>
          <input
            id="bundlerUrl"
            type="text"
            value={bundlerUrl}
            onChange={(e) => setBundlerUrl(e.target.value)}
            placeholder="e.g., https://api.pimlico.io/v1/sepolia/rpc?apikey=YOUR_API_KEY"
            required
          />
        </div>
        <div>
          <label htmlFor="paymasterUrl">Paymaster URL:</label>
          <input
            id="paymasterUrl"
            type="text"
            value={paymasterUrl}
            onChange={(e) => setPaymasterUrl(e.target.value)}
            placeholder="e.g., https://api.aastar.xyz/paymaster"
            required
          />
        </div>
        <button type="submit">Save Configuration</button>
      </form>
    </div>
  );
};

export default TestEnvironmentSetup;
