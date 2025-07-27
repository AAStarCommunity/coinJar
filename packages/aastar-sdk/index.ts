
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
    const { address } = await this.post('/register/finish', { email, attestation });
    console.log('SDK: Registration finalized. Received address:', address);

    return address;
  }

  /**
   * Sends a transaction.
   */
  async sendTransaction(transactionData: { to: string; amount: string }): Promise<string> {
    const address = await this.getAddress();
    if (!address) {
      throw new Error('User is not logged in.');
    }
    console.log('SDK: Starting sendTransaction with data:', transactionData);

    // 1. Prepare transaction and get challenge from backend
    const { unsignedUserOpHash } = await this.post('/transaction/prepare', { address, ...transactionData });
    console.log('SDK: Received unsignedUserOpHash from backend:', unsignedUserOpHash);

    // 2. Call Passkey to sign the challenge (UserOperation hash)
    let assertion;
    try {
      // In a real scenario, the challenge would be part of a PublicKeyCredentialRequestOptions object
      // For this demo, we simulate this by creating a dummy options object.
      const requestOptions = {
        challenge: Buffer.from(unsignedUserOpHash).toString('base64url'),
        timeout: 60000,
        rpId: window.location.hostname,
      };
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
   * Gets the current user's address.
   * (For this demo, we'll use localStorage to persist the address after registration)
   */
  async getAddress(): Promise<string | null> {
    // This is a simplified login check for the demo.
    // A real implementation would involve a login flow.
    const address = localStorage.getItem('aastar_user_address');
    return address;
  }

   /**
   * A helper to store address after registration to simulate a logged-in state.
   */
  async setAddress(address: string): Promise<void> {
    localStorage.setItem('aastar_user_address', address);
  }
}
