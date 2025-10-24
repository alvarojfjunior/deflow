import { ObjectId } from "mongodb";
import { connectDb } from "../../lib/db";
import { WalletDoc } from "../../types/database";
import { getBalance } from "../../lib/connectors/blockchain";
import { parentPort, workerData } from "worker_threads";
import { log } from "../utils/logs";

const automation = workerData;

console.log(`🏃 Worker iniciado: ${automation.name}`);

parentPort?.on("message", async (msg) => {
  if (msg.type === "run") {
    try {
      console.log(`⚙️ Executando tarefa de ${automation.name}...`);
      const start = Date.now();

      const db = await connectDb();
      const wallets = db.collection<WalletDoc>("wallets");
      const wallet = await wallets.findOne({
        userId: new ObjectId(automation.userId),
      });
      if (!wallet) {
        throw new Error("Wallet not found");
      }

      const balance = await getBalance('solana', wallet);

      parentPort?.postMessage({
        type: "success",
        data: balance,
      });

      const elapsed = Date.now() - start;
      parentPort?.postMessage({
        type: "success",
        data: `${automation.name} concluído em ${elapsed}ms`,
      });
    } catch (err: any) {
      parentPort?.postMessage({
        type: "error",
        data: err.message,
      });
    }
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
