export type Automation = {
  _id: string;
  userId: string;
  strategy: {
    name: "poolAutomation" | "dcaAutomation" | string; // pode expandir com outras estratégias
    params: {
      blockchain: "solana"; // opcionalmente limitar blockchains
      walletId: string;
    };
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
