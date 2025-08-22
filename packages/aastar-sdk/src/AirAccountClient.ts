import { AirAccount } from './AirAccount';
import { UserOperationStruct } from '@account-abstraction/contracts';
import { JsonRpcProvider } from '@ethersproject/providers';

export class AirAccountClient {
  public account: AirAccount;
  public bundlerUrl: string;
  private provider: JsonRpcProvider;

  constructor(params: { account: AirAccount; bundlerUrl: string }) {
    this.account = params.account;
    this.bundlerUrl = params.bundlerUrl;
    this.provider = new JsonRpcProvider(this.bundlerUrl);
  }

  async sendUserOperation(userOp: UserOperationStruct): Promise<`0x${string}`> {
    const userOpHash = await this.provider.send('eth_sendUserOperation', [userOp, await this.account.getAccountAddress()]);
    return userOpHash as `0x${string}`;
  }

  async getUserOperationReceipt(userOpHash: `0x${string}`): Promise<any> {
    const receipt = await this.provider.send('eth_getUserOperationReceipt', [userOpHash]);
    return receipt;
  }
}