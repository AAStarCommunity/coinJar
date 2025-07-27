
import React, { useState } from 'react';

// 模拟 AAStar SDK - 在实际开发中，这将从 '@aastar/sdk' 导入
const sdk = {
  register: async (email: string): Promise<string> => {
    console.log(`SDK: Registering with email: ${email}`);
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 返回一个虚假的地址
    return '0xe24b6f321B0140716a2b671ed0D983bb64E7DaFA';
  },
  sendTransaction: async (txData: object): Promise<string> => {
    console.log('SDK: Sending transaction with data:', txData);
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 返回一个虚假的交易哈希
    return `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  }
};

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
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!email) {
      alert('Please enter an email.');
      return;
    }
    setIsLoading(true);
    try {
      // 调用SDK的注册方法
      const address = await sdk.register(email);
      setUserAddress(address);
    } catch (error) {
      console.error(error);
      alert('Registration failed!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTransaction = async () => {
    setIsLoading(true);
    setTxHash(null);
    try {
      // 调用SDK的交易方法
      const hash = await sdk.sendTransaction({ to: '0x1234...', amount: '0.01' });
      setTxHash(hash);
    } catch (error) {
      console.error(error);
      alert('Transaction failed!');
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
