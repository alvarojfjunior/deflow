import { ObjectId } from "mongodb";
import { EncryptedSecret } from "../lib/crypto";


export type WalletDoc = {
  _id: ObjectId;
  userId: ObjectId;
  name: string;
  blockchain: 'solana';
  secret: EncryptedSecret;
  createdAt: Date;
  updatedAt: Date;
};

export type UserDoc = {
  _id: ObjectId;
  authId: string;
  email: string;
  createdAt: Date;
};
