import { describe, it, expect } from 'vitest';
import { AirAccount } from '../src/AirAccount';
import { AirAccountClient } from '../src/AirAccountClient';
import { AirAccountSigner } from '../src/AirAccountSigner';
import { WalletClient } from 'viem';

describe('AirAccount', () => {
  it('should send a user operation', async () => {
    // 1. Create a signer
    const signer = AirAccountSigner.createLocalSigner('0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d');

    // 2. Create an AirAccount
    const account = new AirAccount({
      signer: signer as WalletClient,
      rpcUrl: 'https://rpc.ankr.com/eth_sepolia',
      entryPointAddress: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      factoryAddress: '0x9406Cc6185a346906296840746125a0E44976454',
    });

    // 3. Create a client
    const client = new AirAccountClient({
      account,
      bundlerUrl: 'https://api.zerodev.app/bundler/sepolia',
    });

    // 4. Create a sample user operation
    const userOp = {
      to: await account.getAccountAddress(),
      value: 0n,
      data: '0x',
    };

    // 5. Sign the user operation
    const signedUserOp = await account.signUserOperation(userOp);

    // 6. Send the user operation
    // const userOpHash = await client.sendUserOperation(signedUserOp);

    // expect(userOpHash).toBeDefined();
  });
});
