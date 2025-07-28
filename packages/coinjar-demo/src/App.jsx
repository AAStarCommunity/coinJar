import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { AAStarSDK } from '@aastar/sdk';

const sdk = new AAStarSDK({ backendUrl: 'http://localhost:4000' });

// --- Helper Functions ---
const maskEmail = (email) => email ? `${email.substring(0, 2)}****@${email.split('@')[1]}` : '';
const maskAddress = (address) => address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '';

// --- Styles ---
const styles = {
  container: { fontFamily: 'sans-serif', maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' },
  button: { width: '100%', padding: '10px', border: 'none', background: '#007bff', color: 'white', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' },
  input: { width: 'calc(100% - 22px)', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' },
  userInfo: { background: '#f0f0f0', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'left', wordBreak: 'break-all' },
  modeSwitcher: { display: 'flex', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '4px' },
  modeButton: (isActive) => ({
    flex: 1, padding: '10px', border: 'none',
    background: isActive ? '#007bff' : '#f0f0f0',
    color: isActive ? 'white' : 'black', cursor: 'pointer'
  }),
  scannerRegion: { border: '1px solid #ccc', padding: '10px', marginTop: '20px' }
};

// --- App Component ---
function App() {
  const [step, setStep] = useState('loading'); // loading, enter_email, enter_code, logged_in
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState('receive');
  const [showScanner, setShowScanner] = useState(false);

  // Check for existing session on initial load
  useEffect(() => {
    const info = sdk.getLoginInfo();
    if (info) {
      setUserInfo(info);
      setStep('logged_in');
    } else {
      setStep('enter_email');
    }
  }, []);

  // QR Code Scanner Effect
  useEffect(() => {
    if (step === 'logged_in' && mode === 'pay' && showScanner) {
      const scanner = new Html5QrcodeScanner('qr-reader', { qrbox: { width: 250, height: 250 }, fps: 10 }, false);
      const onScanSuccess = (decodedText) => {
        scanner.clear();
        setShowScanner(false);
        alert(`Scanned Address: ${decodedText}. Transaction would be sent here.`);
      };
      scanner.render(onScanSuccess, () => {});
      return () => { scanner.clear().catch(() => {}); };
    }
  }, [showScanner, mode, step]);

  const handleEmailSubmit = async () => {
    setIsLoading(true);
    const existingUser = sdk.getLoginInfo();
    if (existingUser) {
      try {
        const info = await sdk.loginWithPasskey(email);
        setUserInfo(info);
        setStep('logged_in');
      } catch (e) { alert(e.message); }
    } else {
      await sdk.sendVerificationCode(email);
      setStep('enter_code');
    }
    setIsLoading(false);
  };

  const handleCodeSubmit = async () => {
    setIsLoading(true);
    try {
      if (await sdk.verifyCode(email, code)) {
        const info = await sdk.registerWithPasskey(email);
        setUserInfo(info);
        setStep('logged_in');
      }
    } catch (e) { alert(e.message); }
    setIsLoading(false);
  };

  const handleLogout = () => {
    sdk.logout();
    setUserInfo(null);
    setEmail('');
    setStep('enter_email');
  };

  // --- RENDER LOGIC ---
  if (step === 'loading') return <div>Loading...</div>;

  if (step !== 'logged_in') {
    return (
      <div style={styles.container}>
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
  }

  return (
    <div style={styles.container}>
      <div style={styles.userInfo}>
        <p><strong>User:</strong> {maskEmail(userInfo.email || email)}</p>
        <p><strong>Address:</strong> {maskAddress(userInfo.address)}</p>
        <button onClick={handleLogout} style={{...styles.button, background: 'grey', fontSize: '12px', padding: '5px'}}>Logout</button>
      </div>

      <div style={styles.modeSwitcher}>
        <button onClick={() => { setMode('receive'); setShowScanner(false); }} style={styles.modeButton(mode === 'receive')}>Receive</button>
        <button onClick={() => setMode('pay')} style={styles.modeButton(mode === 'pay')}>Pay</button>
      </div>

      {mode === 'receive' && (
        <div>
          <h4>Your Payment QR Code</h4>
          <QRCodeSVG value={`ethereum:${userInfo.address}@11155111`} size={256} />
          <p style={{ fontSize: '12px', color: '#555' }}>Scan with any wallet on <strong>Sepolia Testnet</strong></p>
        </div>
      )}

      {mode === 'pay' && (
        <div>
          <button onClick={() => setShowScanner(!showScanner)} style={styles.button}>{showScanner ? 'Cancel Scan' : 'Scan QR to Pay'}</button>
          {showScanner && <div id="qr-reader" style={styles.scannerRegion}></div>}
        </div>
      )}
    </div>
  );
}

export default App;
