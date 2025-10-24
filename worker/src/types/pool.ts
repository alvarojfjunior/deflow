export interface Pool {
  id: string;
  tokenA: string;
  tokenB: string;
  apr: number;
  tvl: number;
  volume24h: number;
}