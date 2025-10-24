import web3 from "@solana/web3.js";
import { constants } from "./constants";
import { WalletDoc } from "../../../../types/database";
import { getSolanaKeypair } from "./utils/keypair";

const getConnection = () => {
  const net = process.env.NET || "testnet";
  const rpc = constants[net as keyof typeof constants]?.rpcs?.[0];
  if (!rpc) throw new Error(`RPC not configured for NET=${net}`);
  return new web3.Connection(rpc, "confirmed");
};

const getBalance = async (wallet: WalletDoc) => {
  const keypair = await getSolanaKeypair(wallet);
  console.log(keypair.publicKey.toBase58())

//   const connection = getConnection();
//   const lamports = await connection.getBalance(keypair.publicKey);
  return 123;
};

const getTokenBalance = async (address: string) => {
  return address;
};

const getPublicKey = async (wallet: WalletDoc) => {
  const keypair = await getSolanaKeypair(wallet);
  console.log(keypair.publicKey.toBase58())
  return keypair.publicKey.toBase58();
};

const signAndSendTransaction = async (wallet: WalletDoc) => {
 return wallet
};

const getTransactionStatus = async (address: string) => {
  return address;
};

export default {
  getBalance,
  getTokenBalance,
  getPublicKey,
  signAndSendTransaction,
  getTransactionStatus,
} as const;
