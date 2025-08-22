import React, { useState, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { AAStarSDK } from '@aastar/sdk';

const sdk = new AAStarSDK({ backendUrl: 'http://localhost:4000' });

// --- Helper Functions ---
const maskEmail = (email) => email ? `${email.substring(0, 2)}****@${email.split('@')[1]}` : '';
const maskAddress = (address) => address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '';

// --- Styles ---
const styles = {
  container: { fontFamily: 'sans-serif', maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center', background: '#fff' },
  button: { width: '100%', padding: '12px', border: 'none', background: '#007bff', color: 'white', borderRadius: '4px', cursor: 'pointer', marginTop: '10px', fontSize: '16px' },
  input: { width: 'calc(100% - 24px)', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' },
  select: { width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', background: 'white' },
  userInfo: { background: '#f0f0f0', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'left', wordBreak: 'break-all', position: 'relative', minHeight: '100px' },
  modeSwitcher: { display: 'flex', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '4px' },
  modeButton: (isActive) => ({
    flex: 1, padding: '10px', border: 'none',
    background: isActive ? '#007bff' : '#f0f0f0',
    color: isActive ? 'white' : 'black', cursor: 'pointer'
  }),
  scannerRegion: { border: '2px dashed #ccc', padding: '10px', marginTop: '20px', borderRadius: '8px' },
  historyItem: { background: '#f9f9f9', padding: '10px', borderRadius: '4px', margin: '5px 0', textAlign: 'left', fontSize: '14px' },
  paymentView: { padding: '20px', border: '1px solid #eee', borderRadius: '8px', marginTop: '20px' },
  paymentDetails: { textAlign: 'left', margin: '20px 0', fontSize: '16px' },
  loadingSpinner: { border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '20px auto' },
  successCheck: { color: '#28a745', fontSize: '50px' }
};

// --- Keyframes for spinner ---
const keyframes = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = keyframes;
document.head.appendChild(styleSheet);


// --- Child Components ---

const LoginView = ({ onLogin }) => {
  const [step, setStep] = useState('enter_email'); // enter_email, enter_code
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async () => {
    setIsLoading(true);
    try {
      // Check if user already has a passkey (for demo purposes)
      if (localStorage.getItem(`aastar_user_info_${email}`)) {
         const info = await sdk.loginWithPasskey(email);
         onLogin(info, email);
      } else {
        await sdk.sendVerificationCode(email);
        setStep('enter_code');
      }
    } catch (e) {
      alert(e.message);
    }
    setIsLoading(false);
  };

  const handleCodeSubmit = async () => {
    setIsLoading(true);
    try {
      if (await sdk.verifyCode(email, code)) {
        const info = await sdk.registerWithPasskey(email);
        onLogin(info, email);
      }
    } catch (e) {
      alert(e.message);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h2>Welcome to CoinJar</h2>
      {step === 'enter_email' ? (
        <div>
          <input onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" style={styles.input} />
          <button onClick={handleEmailSubmit} disabled={isLoading} style={styles.button}>{isLoading ? '...' : 'Continue'}</button>
        </div>
      ) : (
        <div>
          <p>A code was sent to {email}.</p>
          <input onChange={(e) => setCode(e.target.value)} placeholder="Enter any 6 digits" style={styles.input} />
          <p style={{fontSize: '10px', color: 'grey'}}>(Hint: Any 6-digit code will work)</p>
          <button onClick={handleCodeSubmit} disabled={isLoading} style={styles.button}>{isLoading ? '...' : 'Verify & Register'}</button>
        </div>
      )}
    </div>
  );
};

const PaymentView = ({ prices, onPaymentSuccess, onCancel }) => {
  const [step, setStep] = useState('input'); // input, confirm, sending, success
  const [fiatAmount, setFiatAmount] = useState('100');
  const [fiatCurrency, setFiatCurrency] = useState('THB');
  const [selectedToken, setSelectedToken] = useState('USDT');
  const [tokenAmount, setTokenAmount] = useState(0);

  useEffect(() => {
    if (prices && fiatAmount) {
      const rate = prices[selectedToken][fiatCurrency];
      const amount = parseFloat(fiatAmount) / rate;
      setTokenAmount(amount.toFixed(6));
    }
  }, [fiatAmount, fiatCurrency, selectedToken, prices]);

  const handlePay = async () => {
    setStep('sending');
    try {
      // This is a mock transaction
      await new Promise(resolve => setTimeout(resolve, 2000)); 
      const txDetails = {
        fiatAmount,
        fiatCurrency,
        token: selectedToken,
        tokenAmount,
        date: new Date().toLocaleString()
      };
      onPaymentSuccess(txDetails);
      setStep('success');
    } catch (error) {
      alert('Payment failed!');
      setStep('confirm'); // Go back to confirm step
    }
  };

  if (step === 'sending') {
    return (
      <div style={styles.paymentView}>
        <h4>Sending Transaction...</h4>
        <div style={styles.loadingSpinner}></div>
        <p>Please verify with your passkey.</p>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div style={styles.paymentView}>
        <div style={styles.successCheck}>✓</div>
        <h4>Payment Successful!</h4>
        <button onClick={onCancel} style={styles.button}>Done</button>
      </div>
    );
  }

  return (
    <div style={styles.paymentView}>
      <h4>New Payment</h4>
      {step === 'input' ? (
        <>
          <input
            type="number"
            value={fiatAmount}
            onChange={(e) => setFiatAmount(e.target.value)}
            placeholder="Amount"
            style={styles.input}
          />
          <select value={fiatCurrency} onChange={(e) => setFiatCurrency(e.target.value)} style={styles.select}>
            <option value="THB">THB</option>
            <option value="RMB">RMB</option>
            <option value="USD">USD</option>
          </select>
          <select value={selectedToken} onChange={(e) => setSelectedToken(e.target.value)} style={styles.select}>
            {prices && Object.keys(prices).map(token => <option key={token} value={token}>{token}</option>)}
          </select>
          <p>You will pay: <strong>{tokenAmount} {selectedToken}</strong></p>
          <button onClick={() => setStep('confirm')} style={styles.button}>Next</button>
          <button onClick={onCancel} style={{...styles.button, background: 'grey'}}>Cancel</button>
        </>
      ) : ( // confirm step
        <>
          <div style={styles.paymentDetails}>
            <p><strong>Amount:</strong> {fiatAmount} {fiatCurrency}</p>
            <p><strong>Token:</strong> {tokenAmount} {selectedToken}</p>
            <p><strong>To:</strong> A Random Merchant</p>
          </div>
          <button onClick={handlePay} style={styles.button}>Pay Now</button>
          <button onClick={() => setStep('input')} style={{...styles.button, background: 'grey'}}>Back</button>
        </>
      )}
    </div>
  );
};


// --- Main App Component ---
function App() {
  const [step, setStep] = useState('loading'); // loading, login, logged_in
  const [userInfo, setUserInfo] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [mode, setMode] = useState('receive'); // receive, pay
  const [view, setView] = useState('main'); // main, scanner, payment
  const [prices, setPrices] = useState(null);
  const [history, setHistory] = useState([]);
  const [scannedAddress, setScannedAddress] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState('op_sepolia'); // Default to OP Sepolia

  // Initial Load: Check login, fetch prices, and fetch history
  useEffect(() => {
    const info = sdk.getLoginInfo();
    if (info) {
      setUserInfo(info);
      setUserEmail(info.email); // Assuming email is stored in info
      setStep('logged_in');
    } else {
      setStep('login');
    }
    
    sdk.getPrices().then(setPrices).catch(err => console.error("Failed to fetch prices:", err));
    
    // Fetch history data
    sdk.getHistory().then(setHistory).catch(err => console.error("Failed to fetch history:", err));
  }, []);

  // QR Code Scanner Effect
  const onScanSuccess = useCallback((decodedText) => {
    // In a real app, you'd validate the address format
    setScannedAddress(decodedText);
    setView('payment');
  }, []);

  useEffect(() => {
    if (view === 'scanner') {
      const scanner = new Html5QrcodeScanner('qr-reader', { qrbox: { width: 250, height: 250 }, fps: 10 }, false);
      scanner.render(onScanSuccess, () => {});
      return () => {
        scanner.clear().catch(error => console.error("Failed to clear scanner.", error));
      };
    }
  }, [view, onScanSuccess]);

  const handleLogin = (info, email) => {
    setUserInfo(info);
    setUserEmail(email);
    setStep('logged_in');
  };

  const handleLogout = () => {
    sdk.logout(userEmail);
    setUserInfo(null);
    setUserEmail('');
    setStep('login');
  };

  const handlePaymentSuccess = (txDetails) => {
    setHistory(prev => [txDetails, ...prev]);
    setView('main'); // Go back to main view after success
  };

  // --- RENDER LOGIC ---
  if (step === 'loading') return <div style={styles.container}>Loading...</div>;
  if (step === 'login') return <div style={styles.container}><LoginView onLogin={handleLogin} /></div>;

  return (
    <div style={styles.container}>
      <div style={styles.userInfo}>
        <p><strong>User:</strong> {maskEmail(userEmail)}</p>
        <p><strong>Address:</strong> {maskAddress(userInfo.address)}</p>
        <select value={selectedNetwork} onChange={(e) => setSelectedNetwork(e.target.value)} style={{...styles.select, position: 'absolute', top: '10px', right: '10px', width: 'auto', margin: '0'}}>
          <option value="op_sepolia">OP Sepolia</option>
          <option value="op_mainnet">OP Mainnet</option>
        </select>
        <button onClick={handleLogout} style={{...styles.button, background: 'grey', fontSize: '12px', padding: '5px', width: 'auto', position: 'absolute', bottom: '10px', left: '10px'}}>Logout</button>
      </div>

      <div style={styles.modeSwitcher}>
        <button onClick={() => { setMode('receive'); setView('main'); }} style={styles.modeButton(mode === 'receive')}>Receive</button>
        <button onClick={() => { setMode('pay'); setView('main'); }} style={styles.modeButton(mode === 'pay')}>Pay</button>
        <button onClick={() => { setMode('history'); setView('main'); }} style={styles.modeButton(mode === 'history')}>History</button>
      </div>

      {mode === 'receive' && (
        <div>
          <h4>Your Payment QR Code</h4>
          <QRCodeSVG value={`ethereum:${userInfo.address}@${selectedNetwork}`} size={256} />
          <p style={{ fontSize: '12px', color: '#555' }}>Scan with any wallet on <strong>{selectedNetwork === 'op_sepolia' ? 'OP Sepolia' : 'OP Mainnet'}</strong></p>
        </div>
      )}

      {mode === 'pay' && view === 'main' && (
         <button onClick={() => setView('scanner')} style={styles.button}>Scan QR to Pay</button>
      )}
      
      {mode === 'pay' && view === 'scanner' && (
        <div>
          <div id="qr-reader" style={styles.scannerRegion}></div>
          <button onClick={() => setView('main')} style={{...styles.button, background: 'grey'}}>Cancel</button>
        </div>
      )}

      {mode === 'pay' && view === 'payment' && (
        <PaymentView 
          prices={prices}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={() => setView('main')}
        />
      )}

      {mode === 'history' && (
        <div style={{marginTop: '30px'}}>
          <h4>Transaction History</h4>
          {history.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            history.map((tx, i) => (
              <div key={i} style={styles.historyItem}>
                Paid {tx.fiatAmount} {tx.fiatCurrency} ({tx.tokenAmount} {tx.token}) on {tx.date}
              </div>
            ))
          )}
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        <a href="http://localhost:8000/">&larr; Back to Launchpad</a>
      </div>
    </div>
  );
}

export default App;