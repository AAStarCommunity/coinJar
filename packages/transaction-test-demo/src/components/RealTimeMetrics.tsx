import React from 'react';

interface RealTimeMetricsProps {
  transactionsSent: number;
  totalTransactions: number;
}

const RealTimeMetrics: React.FC<RealTimeMetricsProps> = ({ transactionsSent, totalTransactions }) => {
  const progress = totalTransactions > 0 ? (transactionsSent / totalTransactions) * 100 : 0;

  return (
    <div className="card">
      <h2>Real-Time Metrics</h2>
      <p>Transactions Sent: {transactionsSent} / {totalTransactions}</p>
      <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '5px' }}>
        <div
          style={{
            width: `${progress}%`,
            backgroundColor: '#4CAF50',
            height: '20px',
            borderRadius: '5px',
            textAlign: 'center',
            color: 'white',
            lineHeight: '20px',
          }}
        >
          {progress.toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

export default RealTimeMetrics;
