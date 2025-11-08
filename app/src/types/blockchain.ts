export enum BlockchainNetwork {
  SOLANA = 'solana'
}

export enum NetworkEnvironment {
  MAINNET = 'mainnet',
  DEVNET = 'devnet',
  TESTNET = 'testnet'
}

export interface BlockchainConfig {
  network: BlockchainNetwork;
  environment: NetworkEnvironment;
  rpcUrl?: string;
}

export interface TokenBalance {
  symbol: string;
  amount: number;
  decimals: number;
}

export interface TransactionResult {
  success: boolean;
  transactionId: string;
}

export interface GetBalanceParams {
  walletId: string;
  network: BlockchainNetwork;
}

export interface SendTransactionParams {
  walletId: string;
  network: BlockchainNetwork;
  transaction: any;
}

export interface WalletBalance {
  nativeBalance: number;
  tokens: TokenBalance[];
}