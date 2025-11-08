export type PoolAutomationParams = {
  blockchain: "solana";
  walletId: string;
  allocationMode?: "APR" | "TVL" | "APR/TVL" | string;
  maxActivePools?: number;
  impermanentLossTolerancePer?: number;
  stopWinPer?: number;
  exitOnTVLDropPer?: number;
  exitOnAPRDropPer?: number;
  maxTimeOutOfRange?: number;
};


export type Automation = {
  _id: string;
  userId: string;
  strategy: {
    name: "poolAutomation";
    params: PoolAutomationParams;
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
