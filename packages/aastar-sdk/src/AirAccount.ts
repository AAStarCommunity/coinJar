import { WalletClient } from 'viem';
import { SimpleAccountAPI } from '@account-abstraction/sdk';
import { JsonRpcProvider } from '@ethersproject/providers';

export class AirAccount {
  private simpleAccountAPI: SimpleAccountAPI;

  constructor(params: {
    signer: WalletClient;
    rpcUrl: string;
    entryPointAddress: string;
    factoryAddress: string;
  }) {
    const provider = new JsonRpcProvider(params.rpcUrl);
    this.simpleAccountAPI = new SimpleAccountAPI({
      owner: params.signer as any,
      provider,
      entryPointAddress: params.entryPointAddress,
      factoryAddress: params.factoryAddress,
    });
  }

  async getAccountAddress(): Promise<`0x${string}`> {
    return this.simpleAccountAPI.getAccountAddress() as Promise<`0x${string}`>;
  }

  async getNonce(): Promise<number> {
    return this.simpleAccountAPI.getNonce();
  }

  async signUserOperation(userOp: any): Promise<`0x${string}`> {
    return this.simpleAccountAPI.signUserOp(userOp);
  }

  async getAccountInitCode(): Promise<`0x${string}`> {
    return this.simpleAccountAPI.getInitCode() as Promise<`0x${string}`>;
  }
}