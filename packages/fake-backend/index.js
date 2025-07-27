
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
    pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
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

app.listen(port, () => {
  console.log(`Fake backend listening at http://localhost:${port}`);
});
