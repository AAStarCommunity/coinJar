import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
// AASTar SDK v0.2.0
export class AAStarSDK {
    backendUrl;
    constructor(config) {
        this.backendUrl = config.backendUrl;
    }
    async post(endpoint, body) {
        const response = await fetch(`${this.backendUrl}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `API call to ${endpoint} failed`);
        }
        return response.json();
    }
    async sendVerificationCode(email) {
        await this.post('/email/send-code', { email });
    }
    async verifyCode(email, code) {
        const { success } = await this.post('/email/verify-code', { email, code });
        return success;
    }
    async registerWithPasskey(email) {
        const creationOptions = await this.post('/register/start', { email });
        const attestation = await startRegistration(creationOptions);
        const { address, credentialID } = await this.post('/register/finish', { email, attestation });
        const loginInfo = { address, credentialID };
        this.saveLoginInfo(loginInfo);
        return loginInfo;
    }
    async loginWithPasskey(email) {
        // In a real app, the backend would look up the user's credentialID by email
        // For this demo, we retrieve it from localStorage.
        const storedInfo = this.getLoginInfo();
        if (!storedInfo)
            throw new Error('No stored credential found for login.');
        const { unsignedUserOpHash } = await this.post('/transaction/prepare', { address: storedInfo.address, to: 'login', amount: '0' });
        const assertion = await startAuthentication({
            challenge: this.strToBase64url(unsignedUserOpHash),
            allowCredentials: [{ id: storedInfo.credentialID, type: 'public-key' }],
        });
        // In a real app, you'd verify this assertion on the backend.
        return storedInfo;
    }
    getLoginInfo() {
        const info = localStorage.getItem('aastar_user_info');
        return info ? JSON.parse(info) : null;
    }
    saveLoginInfo(info) {
        localStorage.setItem('aastar_user_info', JSON.stringify(info));
    }
    logout() {
        localStorage.removeItem('aastar_user_info');
    }
    async getPrices() {
        const response = await fetch(`${this.backendUrl}/prices`);
        if (!response.ok) {
            throw new Error('Failed to fetch prices');
        }
        return response.json();
    }
    async getHistory() {
        const response = await fetch(`${this.backendUrl}/history`);
        if (!response.ok) {
            throw new Error('Failed to fetch history');
        }
        return response.json();
    }
    // Helper function from previous step
    strToBase64url(str) {
        const buffer = new TextEncoder().encode(str);
        return window.btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer))))
            .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }
}
