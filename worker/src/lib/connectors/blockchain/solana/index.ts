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
  const connection = getConnection();
  const lamports = await connection.getBalance(keypair.publicKey);
  return lamports;
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

// Retorna todos os tokens SPL + saldo de SOL
const getTokenBalances = async (wallet: WalletDoc) => {
  const connection = getConnection();
  const keypair = await getSolanaKeypair(wallet);
  const owner = keypair.publicKey;

  // SOL nativo
  const lamports = await connection.getBalance(owner);
  const solEntry = {
    mint: "SOL",
    tokenAccount: owner.toBase58(),
    amount: lamports.toString(),
    decimals: 9,
    uiAmount: lamports / 1_000_000_000,
    isNative: true,
  };

  // SPL tokens
  const TOKEN_PROGRAM_ID = new web3.PublicKey(
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
  );
  const resp = await connection.getParsedTokenAccountsByOwner(owner, {
    programId: TOKEN_PROGRAM_ID,
  });

  const tokens = resp.value
    .map(({ pubkey, account }) => {
      const info = (account.data as any).parsed.info;
      const tokenAmount = info.tokenAmount;
      const uiAmount =
        tokenAmount.uiAmount ?? Number(tokenAmount.uiAmountString);
      return {
        mint: info.mint as string,
        tokenAccount: pubkey.toBase58(),
        amount: tokenAmount.amount as string,
        decimals: tokenAmount.decimals as number,
        uiAmount: uiAmount as number,
        isNative: false,
      };
    })
    // Remova este filtro se quiser incluir contas com saldo zero
    .filter((t) => Number(t.amount) > 0);

  return [solEntry, ...tokens];
};

export default {
  getBalance,
  getTokenBalance,
  getPublicKey,
  signAndSendTransaction,
  getTransactionStatus,
  getTokenBalances,
} as const;
