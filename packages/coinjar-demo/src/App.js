import React, { useState, useEffect } from 'react';
// 调整为正确的相对路径，并从 dist 目录导入
import { AAStarSDK } from '@aastar/sdk'; 

const sdk = new AAStarSDK({ backendUrl: 'http://localhost:4000' });

const styles = {
  container: { fontFamily: 'sans-serif', maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' },
  input: { width: 'calc(100% - 22px)', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' },
  button: { width: '100%', padding: '10px', border: 'none', background: '#007bff', color: 'white', borderRadius: '4px', cursor: 'pointer' },
  address: { background: '#eee', padding: '8px', borderRadius: '4px', wordBreak: 'break-all', marginBottom: '20px' },
  txHash: { background: '#e0ffe0', padding: '8px', borderRadius: '4px', wordBreak: 'break-all', marginTop: '10px' },
  header: { borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '20px' }
};

function App() {
  const [email, setEmail] = useState('');
  const [userAddress, setUserAddress] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 检查本地是否已存储地址，模拟登录状态
  useEffect(() => {
    // Automatically clear storage on app start for easy testing
    localStorage.clear();
    setUserAddress(null); // Also clear the state

    const checkLoginStatus = () => {
      const info = sdk.getLoginInfo();
      if (info && info.address) {
        setUserAddress(info.address);
      }
    };
    // We call it, but it will be null on first load due to the clear above.
    checkLoginStatus();
  }, []);

  const handleRegister = async () => {
    if (!email) {
      alert('Please enter an email.');
      return;
    }
    setIsLoading(true);
    try {
      const address = await sdk.register(email);
      // The SDK now handles saving the login info internally
      setUserAddress(address);
    } catch (error) {
      console.error(error);
      alert(`Registration failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTransaction = async () => {
    setIsLoading(true);
    setTxHash(null);
    try {
      const hash = await sdk.sendTransaction({ to: '0x1234...', amount: '0.01' });
      setTxHash(hash);
    } catch (error) {
      console.error(error);
      alert(`Transaction failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>CoinJar Demo</h2>
      </div>

      {!userAddress ? (
        <div>
          <h3>1. Register Account</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={styles.input}
          />
          <button onClick={handleRegister} disabled={isLoading} style={styles.button}>
            {isLoading ? 'Registering...' : 'Register with Passkey'}
          </button>
        </div>
      ) : (
        <div>
          <h3>Welcome!</h3>
          <p>Your AirAccount Address (on Sepolia):</p>
          <div style={styles.address}>{userAddress}</div>

          <h3>2. Send a Test Transaction</h3>
          <button onClick={handleSendTransaction} disabled={isLoading} style={styles.button}>
            {isLoading ? 'Sending...' : 'Send Test Transaction'}
          </button>

          {txHash && (
            <div>
              <p>Transaction Sent!</p>
              <div style={styles.txHash}>{txHash}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;