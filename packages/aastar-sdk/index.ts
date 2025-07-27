
import { 
  startRegistration, 
  startAuthentication 
} from '@simplewebauthn/browser';

// AASTar SDK v0.1.5

export class AAStarSDK {
  private backendUrl: string;

  constructor(config: { backendUrl: string }) {
    this.backendUrl = config.backendUrl;
    console.log('AAStar SDK initialized.');
  }

  private async post(endpoint: string, body: object) {
    const response = await fetch(`${this.backendUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`API call to ${endpoint} failed with status ${response.status}`);
    }
    return response.json();
  }

  /**
   * Registers a new user.
   */
  async register(email: string): Promise<string> {
    console.log('SDK: Starting registration for', email);

    // 1. Get challenge from backend
    const creationOptions = await this.post('/register/start', { email });
    console.log('SDK: Received creation options from backend:', creationOptions);

    // 2. Call Passkey to create credential
    let attestation;
    try {
      attestation = await startRegistration(creationOptions);
      console.log('SDK: Passkey registration successful:', attestation);
    } catch (error) {
      console.error('SDK: Passkey registration failed', error);
      throw new Error('Could not create Passkey credential.');
    }

    // 3. Send credential to backend to finalize
    const { address, credentialID } = await this.post('/register/finish', { email, attestation });
    console.log(`SDK-DEBUG: Finalizing registration. Address: ${address}, CredentialID: ${credentialID}`);

    // Store both address and credentialID
    const loginInfo = { address, credentialID };
    this.saveLoginInfo(loginInfo);

    return address;
  }

  /**
   * Sends a transaction.
   */
  async sendTransaction(transactionData: { to: string; amount: string }): Promise<string> {
    const loginInfo = this.getLoginInfo();
    console.log('SDK-DEBUG: Retrieved login info for transaction:', loginInfo);

    if (!loginInfo || !loginInfo.credentialID) {
      throw new Error('User is not logged in or credentialID is missing.');
    }
    console.log('SDK: Starting sendTransaction with data:', transactionData);

    // 1. Prepare transaction and get challenge from backend
    const { unsignedUserOpHash } = await this.post('/transaction/prepare', { address: loginInfo.address, ...transactionData });
    console.log('SDK: Received unsignedUserOpHash from backend:', unsignedUserOpHash);

    // A browser-compatible way to convert a string to a base64url string
    const strToBase64url = (str: string) => {
      const buffer = new TextEncoder().encode(str);
      return window.btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer))))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }

    // 2. Call Passkey to sign the challenge (UserOperation hash)
    let assertion;
    try {
      const requestOptions = {
        challenge: strToBase64url(unsignedUserOpHash),
        allowCredentials: [{
          id: loginInfo.credentialID,
          type: 'public-key' as const, // Use 'as const' to satisfy the literal type
        }],
        timeout: 60000,
        rpId: window.location.hostname,
      };
      console.log('SDK-DEBUG: Calling startAuthentication with options:', JSON.stringify(requestOptions, null, 2));
      assertion = await startAuthentication(requestOptions);
      console.log('SDK: Passkey authentication successful:', assertion);
    } catch (error) {
      console.error('SDK: Passkey signing failed', error);
      throw new Error('Could not sign transaction with Passkey.');
    }

    // 3. Send signed operation to backend to broadcast
    const { txHash } = await this.post('/transaction/broadcast', { signedUserOp: assertion });
    console.log('SDK: Transaction broadcasted. Received txHash:', txHash);

    return txHash;
  }

  /**
   * Gets the current user's login info.
   */
  getLoginInfo(): { address: string; credentialID: string } | null {
    const infoString = localStorage.getItem('aastar_user_info');
    console.log(`SDK-DEBUG: Reading 'aastar_user_info' from localStorage: ${infoString}`);
    if (!infoString) {
      return null;
    }
    const info = JSON.parse(infoString);
    console.log('SDK-DEBUG: Parsed info from localStorage:', info);
    return info;
  }

   /**
   * A helper to store login info to simulate a logged-in state.
   */
  saveLoginInfo(info: { address: string; credentialID: string }): void {
    console.log('SDK-DEBUG: Saving login info to localStorage:', info);
    localStorage.setItem('aastar_user_info', JSON.stringify(info));
  }
}
