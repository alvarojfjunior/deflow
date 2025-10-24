import { ObjectId } from "mongodb";
import { connectDb } from "../../lib/db";
import { WalletDoc } from "../../types/database";
import { getBalance } from "../../lib/connectors/blockchain";
import { parentPort, workerData } from "worker_threads";
import { logMessage } from "../utils/logs";

const automation = workerData;

parentPort?.on("message", async (msg) => {
  if (!parentPort) {
    throw new Error("parentPort not found");
  }
  if (msg.type === "run") {
    logMessage(parentPort, "just a test");
    const start = Date.now();
    const db = await connectDb();
    const wallets = db.collection<WalletDoc>("wallets");
    const wallet = await wallets.findOne({
      _id: new ObjectId(String(automation.strategy.params.walletId)),
    });
    if (!wallet) {
      throw new Error("Wallet not found");
    }

    const balance = await getBalance("solana", wallet);

    logMessage(parentPort, balance);
    
    const elapsed = Date.now() - start;
    logMessage(parentPort, `${automation.name} concluído em ${elapsed}ms`);
  }
});

// await (automationId: string, automation: Automation) {
//   console.log('Strategy', automation.name, 'started');
//   const db = await connectDb();
//   const wallets = db.collection<WalletDoc>('wallets');
//   const wallet = await wallets.findOne({ userId: new ObjectId(automation.userId) });
//   if (!wallet) {
//     throw new Error('Wallet not found');
//   }
//   const balance = await getBalance(automation.strategy.params.blockchain, wallet);

//   console.log(balance)

//   // Finaliza
//   console.log('Strategy', automation.name, 'completed');
// }
