import { WalletDoc } from "../../../types/database";
import solana from "./solana";

const connectors = {
  solana,
} as const;

type SupportedBlockchain = keyof typeof connectors;

export const getBalance = async (
  wallet: WalletDoc,
  blockchain: SupportedBlockchain
) => {
  return connectors[blockchain].getBalance(wallet);
};

export const getTokenBalance = async (
  address: string,
  blockchain: SupportedBlockchain
) => {
  return connectors[blockchain].getTokenBalance(address);
};

// Novo: lista todos os tokens da carteira
export const getTokenBalances = async (
  wallet: WalletDoc,
  blockchain: SupportedBlockchain
) => {
  return connectors[blockchain].getTokenBalances(wallet);
};

export const getPublicKey = async (
  wallet: WalletDoc,
  blockchain: SupportedBlockchain
) => {
  return connectors[blockchain].getPublicKey(wallet);
};

export const signAndSendTransaction = async (
  wallet: WalletDoc,
  blockchain: SupportedBlockchain
) => {
  return connectors[blockchain].signAndSendTransaction(wallet);
};

export const getTransactionStatus = async (
  address: string,
  blockchain: SupportedBlockchain
) => {
  return connectors[blockchain].getTransactionStatus(address);
};
