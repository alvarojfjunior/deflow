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


export type HistoryDoc = {
  _id: ObjectId;
  automationId: ObjectId;
  userId: ObjectId;
  action: string;
  params: any;
  createdAt: Date;
  updatedAt: Date;
};



export type AutomationDoc = {
  _id: ObjectId;
  userId: ObjectId;
  strategy: {
    name: "poolAutomation";
    params: any;
  };
  name: string;
  description: string;
  status: "active" | "paused" | "error" | string; // status possíveis
  lastHeartbeatAt: Date;
  createdAt: string;
  updatedAt: string;
  __v: number;
  interval: number;
};
