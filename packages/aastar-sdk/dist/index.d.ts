export declare class AAStarSDK {
    private backendUrl;
    constructor(config: {
        backendUrl: string;
    });
    private post;
    sendVerificationCode(email: string): Promise<void>;
    verifyCode(email: string, code: string): Promise<boolean>;
    registerWithPasskey(email: string): Promise<{
        address: string;
        credentialID: string;
    }>;
    loginWithPasskey(email: string): Promise<{
        address: string;
        credentialID: string;
    }>;
    getLoginInfo(): {
        address: string;
        credentialID: string;
    } | null;
    saveLoginInfo(info: {
        address: string;
        credentialID: string;
    }): void;
    logout(): void;
    getPrices(): Promise<any>;
    getHistory(): Promise<any>;
    private strToBase64url;
}
