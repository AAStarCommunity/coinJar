
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

console.log('Fake backend server starting...');

// 1. `POST /register/start`
app.post('/register/start', (req, res) => {
  const { email } = req.body;
  console.log(`[API] Received /register/start for email: ${email}`);

  // In a real scenario, you would generate a challenge compatible with @simplewebauthn/server
  const challenge = `challenge_for_${email}_${Date.now()}`;
  console.log(`[API] Generated challenge: ${challenge}`);

  // This is a simplified fake response. A real one would be a full PublicKeyCredentialCreationOptions object.
  res.json({
    challenge: Buffer.from(challenge).toString('base64url'),
    rp: { name: 'CoinJar Demo' },
    user: { id: email, name: email, displayName: email },
    pubKeyCredParams: [
      { type: 'public-key', alg: -7 }, // ES256
      { type: 'public-key', alg: -257 } // RS256
    ],
    timeout: 60000,
    attestation: 'none'
  });
});

// 2. `POST /register/finish`
app.post('/register/finish', (req, res) => {
  const { email, attestation } = req.body;
  console.log(`[API] Received /register/finish for email: ${email}`);
  console.log(`[API] Received attestation object:`, JSON.stringify(attestation, null, 2));

  // In a real scenario, you would verify the attestation and create the user.
  // Here, we just return a fake address and the credentialID.
  const fakeAddress = '0xe24b6f321B0140716a2b671ed0D983bb64E7DaFA';
  const credentialID = attestation.id; // Extract credentialID from the attestation
  console.log(`[API] Extracted credentialID: ${credentialID}`);
  console.log(`[API] Returning fake address: ${fakeAddress}`);

  res.json({ address: fakeAddress, credentialID: credentialID });
});

// 3. `POST /transaction/prepare`
app.post('/transaction/prepare', (req, res) => {
  const { address, to, amount } = req.body;
  console.log(`[API] Received /transaction/prepare for address: ${address}`);
  console.log(`[API] Transaction details: to=${to}, amount=${amount}`);

  // In a real scenario, this would be the hash of a UserOperation.
  const unsignedUserOpHash = `hash_for_tx_from_${address}_to_${to}_${Date.now()}`;
  console.log(`[API] Generated unsignedUserOpHash: ${unsignedUserOpHash}`);

  res.json({ unsignedUserOpHash });
});

// 4. `POST /transaction/broadcast`
app.post('/transaction/broadcast', (req, res) => {
  const { signedUserOp } = req.body;
  console.log('[API] Received /transaction/broadcast');
  console.log('[API] Received signedUserOp:', JSON.stringify(signedUserOp, null, 2));

  // In a real scenario, you would broadcast this to the blockchain.
  // Here, we just return a fake transaction hash.
  const fakeTxHash = `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  console.log(`[API] Returning fake txHash: ${fakeTxHash}`);

  res.json({ txHash: fakeTxHash });
});

// 5. `POST /email/send-code`
app.post('/email/send-code', (req, res) => {
  const { email } = req.body;
  console.log(`[API] Received /email/send-code for email: ${email}`);
  // In a real app, you'd send an email here.
  // We'll just pretend it was successful.
  console.log(`[API] Faking sending a verification code to ${email}.`);
  res.json({ success: true });
});

// 6. `POST /email/verify-code`
app.post('/email/verify-code', (req, res) => {
  const { email, code } = req.body;
  console.log(`[API] Received /email/verify-code for email: ${email} with code: ${code}`);
  // In a real app, you'd check the code. Here, any 6-digit code is valid.
  if (code && code.length === 6) {
    console.log(`[API] Code for ${email} is valid.`);
    res.json({ success: true, message: "Email verified." });
  } else {
    console.log(`[API] Code for ${email} is invalid.`);
    res.status(400).json({ success: false, message: "Invalid code." });
  }
});

// 7. `GET /prices`
app.get('/prices', (req, res) => {
  console.log(`[API] Received /prices request`);
  // Fake prices for demo purposes
  const prices = {
    'USDT': { 'USD': 1.00, 'CNY': 7.25, 'THB': 36.70 },
    'USDC': { 'USD': 1.01, 'CNY': 7.32, 'THB': 37.00 },
    'ETH':  { 'USD': 3500, 'CNY': 25375, 'THB': 128450 },
    'BTC':  { 'USD': 65000, 'CNY': 471250, 'THB': 2385500 },
    'PNTS': { 'USD': 0.1, 'CNY': 0.73, 'THB': 3.67 },
  };
  res.json(prices);
});

app.listen(port, () => {
  console.log(`Fake backend listening at http://localhost:${port}`);
});
