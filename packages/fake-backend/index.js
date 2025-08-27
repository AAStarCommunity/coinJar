console.log('--- index.js: Start of file ---');
const express = require('express');
console.log('--- index.js: express required ---');
const bodyParser = require('body-parser');
console.log('--- index.js: body-parser required ---');
const cors = require('cors');
console.log('--- index.js: cors required ---');
const TestOrchestrator = require('./TestOrchestrator'); // <-- Suspect line
console.log('--- index.js: TestOrchestrator required ---');

const app = express();
console.log('--- index.js: app created ---');
const port = 4000;

app.use(cors());
console.log('--- index.js: cors middleware used ---');
app.use(bodyParser.json());
console.log('--- index.js: body-parser middleware used ---');

// --- Existing CoinJar Demo Endpoints ---
console.log('--- index.js: Registering existing CoinJar Demo Endpoints ---');

app.get('/', (req, res) => {
  console.log('--- API: / hit ---');
  res.send('Welcome to the Fake Backend API for CoinJar Demo. This API provides endpoints for user registration, transaction preparation, and broadcasting.');
});
console.log('--- index.js: / registered ---');

// 1. `POST /register/start`
app.post('/register/start', (req, res) => {
  const { email } = req.body;
  console.log(`[API] Received /register/start for email: ${email}`);
  const challenge = `challenge_for_${email}_${Date.now()}`;
  console.log(`[API] Generated challenge: ${challenge}`);
  res.json({
    challenge: Buffer.from(challenge).toString('base64url'),
    rp: { name: 'CoinJar Demo' },
    user: { id: email, name: email, displayName: email },
    pubKeyCredParams: [
      { type: 'public-key', alg: -7 },
      { type: 'public-key', alg: -257 }
    ],
    timeout: 60000,
    attestation: 'none'
  });
});
console.log('--- index.js: /register/start registered ---');

// 2. `POST /register/finish`
app.post('/register/finish', (req, res) => {
  const { email, attestation } = req.body;
  console.log(`[API] Received /register/finish for email: ${email}`);
  console.log(`[API] Received attestation object:`, JSON.stringify(attestation, null, 2));
  const fakeAddress = '0xe24b6f321B0140716a2b671ed0D983bb64E7DaFA';
  const credentialID = attestation.id;
  console.log(`[API] Extracted credentialID: ${credentialID}`);
  console.log(`[API] Returning fake address: ${fakeAddress}`);
  res.json({ address: fakeAddress, credentialID: credentialID });
});
console.log('--- index.js: /register/finish registered ---');

// 3. `POST /transaction/prepare`
app.post('/transaction/prepare', (req, res) => {
  const { address, to, amount } = req.body;
  console.log(`[API] Received /transaction/prepare for address: ${address}`);
  console.log(`[API] Transaction details: to=${to}, amount=${amount}`);
  const unsignedUserOpHash = `hash_for_tx_from_${address}_to_${to}_${Date.now()}`;
  console.log(`[API] Generated unsignedUserOpHash: ${unsignedUserOpHash}`);
  res.json({ unsignedUserOpHash });
});
console.log('--- index.js: /transaction/prepare registered ---');

// 4. `POST /transaction/broadcast`
app.post('/transaction/broadcast', (req, res) => {
  const { signedUserOp } = req.body;
  console.log('[API] Received /transaction/broadcast');
  console.log('[API] Received signedUserOp:', JSON.stringify(signedUserOp, null, 2));
  const fakeTxHash = `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  console.log(`[API] Returning fake txHash: ${fakeTxHash}`);
  res.json({ txHash: fakeTxHash });
});
console.log('--- index.js: /transaction/broadcast registered ---');

// 5. `POST /email/send-code`
app.post('/email/send-code', (req, res) => {
  const { email } = req.body;
  console.log(`[API] Received /email/send-code for email: ${email}`);
  console.log(`[API] Faking sending a verification code to ${email}.`);
  res.json({ success: true });
});
console.log('--- index.js: /email/send-code registered ---');

// 6. `POST /email/verify-code`
app.post('/email/verify-code', (req, res) => {
  const { email, code } = req.body;
  console.log(`[API] Received /email/verify-code for email: ${email} with code: ${code}`);
  if (code && code.length === 6) {
    console.log(`[API] Code for ${email} is valid.`);
    res.json({ success: true, message: "Email verified." });
  } else {
    console.log(`[API] Code for ${email} is invalid.`);
    res.status(400).json({ success: false, message: "Invalid code." });
  }
});
console.log('--- index.js: /email/verify-code registered ---');

// 7. `GET /prices`
app.get('/prices', (req, res) => {
  console.log(`[API] Received /prices request`);
  const prices = {
    'USDT': { 'USD': 1.00, 'CNY': 7.25, 'THB': 36.70 },
    'USDC': { 'USD': 1.01, 'CNY': 7.32, 'THB': 37.00 },
    'ETH':  { 'USD': 3500, 'CNY': 25375, 'THB': 128450 },
    'BTC':  { 'USD': 65000, 'CNY': 471250, 'THB': 2385500 },
    'PNTS': { 'USD': 0.1, 'CNY': 0.73, 'THB': 3.67 },
  };
  res.json(prices);
});
console.log('--- index.js: /prices registered ---');

// 8. `GET /history`
app.get('/history', (req, res) => {
  console.log(`[API] Received /history request`);
  const fakeHistory = [
    {
      fiatAmount: '50',
      fiatCurrency: 'USD',
      token: 'USDT',
      tokenAmount: '50.000000',
      toAddress: '0xAbC123DeF456GhI789JkL012MnP345QrS678TuV90',
      date: new Date(Date.now() - 86400000).toLocaleString()
    },
    {
      fiatAmount: '200',
      fiatCurrency: 'THB',
      token: 'ETH',
      tokenAmount: '0.001557',
      toAddress: '0xDeF456GhI789JkL012MnP345QrS678TuV90AbC123',
      date: new Date(Date.now() - 172800000).toLocaleString()
    },
    {
      fiatAmount: '1000',
      fiatCurrency: 'RMB',
      token: 'BTC',
      tokenAmount: '0.000021',
      toAddress: '0xGhI789JkL012MnP345QrS678TuV90AbC123DeF456',
      date: new Date(Date.now() - 259200000).toLocaleString()
    },
  ];
  res.json(fakeHistory);
});
console.log('--- index.js: /history registered ---');

// --- Test Orchestration Endpoints ---
console.log('--- index.js: Registering Test Orchestration Endpoints ---');

const orchestrator = new TestOrchestrator();
console.log('--- index.js: orchestrator instantiated ---');

app.post('/test/start', (req, res) => {
  console.log('--- API: /test/start hit ---');
  orchestrator.start();
  res.status(200).json({ message: 'Test orchestration started.' });
});
console.log('--- index.js: /test/start registered ---');

app.post('/test/stop', (req, res) => {
  console.log('--- API: /test/stop hit ---');
  orchestrator.stop();
  res.status(200).json({ message: 'Test orchestration stopped.' });
});
console.log('--- index.js: /test/stop registered ---');

app.get('/test/status', (req, res) => {
  console.log('--- API: /test/status hit ---');
  const status = orchestrator.getStatus();
  res.status(200).json(status);
});
console.log('--- index.js: /test/status registered ---');

app.get('/test/results', (req, res) => {
  console.log('--- API: /test/results hit ---');
  const format = req.query.format;
  const results = orchestrator.getResults(format);
  if (format === 'csv') {
    res.header('Content-Type', 'text/csv');
    res.send(results);
  } else {
    res.json(results);
  }
});
console.log('--- index.js: /test/results registered ---');

app.listen(port, () => {
  console.log(`Fake backend listening at http://localhost:${port}`);
  console.log('--- index.js: Server listening callback executed ---');
});
console.log('--- index.js: End of file ---');
