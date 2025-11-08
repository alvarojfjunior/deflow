import { Types } from 'mongoose';

export interface EncryptedSecretDTO {
  algo: 'aes-256-gcm';
  version: 1;
  iv: string;
  tag: string;
  ciphertext: string;
}

export type Blockchain = 'solana';

export interface Wallet {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  blockchain: Blockchain;
  secret: EncryptedSecretDTO; // never expose in UI; API should redact
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletSafeDTO {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  blockchain: Blockchain;
  secretStored: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletFormData {
  name: string;
  blockchain: Blockchain;
  privateKey: string; // plaintext input, will be encrypted server-side
}