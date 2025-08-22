import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';

export class AirAccountSigner {
  static createLocalSigner(privateKey: `0x${string}`) {
    const account = privateKeyToAccount(privateKey);
    const signer = createWalletClient({
      account,
      chain: mainnet,
      transport: http(),
    });
    return signer;
  }
}
