import { WalletDoc } from "../../../../../types/database";
import web3 from '@solana/web3.js';
import { decryptSecret, parseSecretToUint8Array } from "../../../../crypto";

export async function getSolanaKeypair(wallet: WalletDoc): Promise<web3.Keypair> {
  const privateKeyStr = decryptSecret(wallet.secret);
  const secretBytes = parseSecretToUint8Array(privateKeyStr);
  if (secretBytes.length === 64) {
    return web3.Keypair.fromSecretKey(secretBytes);
  }
  if (secretBytes.length === 32) {
    return web3.Keypair.fromSeed(secretBytes);
  }
  throw new Error(`Unexpected secret key length: ${secretBytes.length}`);
}