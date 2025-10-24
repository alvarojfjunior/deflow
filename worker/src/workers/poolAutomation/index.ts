import { ObjectId } from "mongodb";
import { connectDb } from "../../lib/db";
import { WalletDoc } from "../../types/database";
import { getTokenBalances } from "../../lib/connectors/blockchain";
import { parentPort, workerData } from "worker_threads";
import { logMessage } from "../utils/logs";
import { getPools } from "../../lib/connectors/dex";

const automation = workerData;

parentPort?.on("message", async (msg) => {
  if (!parentPort || !automation || !msg) {
    throw new Error("Worker not initialized");
  }
  if (msg.type === "run") {
    const start = Date.now();
    const db = await connectDb();
    const wallets = db.collection<WalletDoc>("wallets");
    const wallet = await wallets.findOne({
      _id: new ObjectId(String(automation.strategy.params.walletId)),
    });
    if (!wallet) {
      throw new Error("Wallet not found");
    }

    const balance = await getTokenBalances(wallet, "solana");

    const pools = await getPools("orca");

    logMessage(balance);
    logMessage(pools);
    
    const elapsed = Date.now() - start;
    logMessage(`${automation.name} concluído em ${elapsed}ms`);
  }
});
