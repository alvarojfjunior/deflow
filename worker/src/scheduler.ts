import "dotenv/config";
import { connectDb } from "./lib/db";
import { Collection, Db } from "mongodb";
import { Automation } from "./types/automation";
import { Worker } from "worker_threads";
import path from "path";

const strategyRunnerMap = {
  poolAutomation: path.resolve(
    __dirname,
    "../dist/workers/poolAutomation/index.js"
  ),
};

let db: Db;

async function main() {
  if (!db) {
    db = await connectDb();
  }
  const automations = db.collection("automations") as Collection<Automation>;

  const globalPolling = Number(process.env.POOLING_INTERVAL || 60_000);
  console.log(`🧠 Scheduler started (polling every ${globalPolling / 1000}s)`);

  // 🧱 Controla workers ativos
  const workers = new Map<string, Worker>();

  while (true) {
    try {
      const activeAutomations = await automations
        .find({ status: "active" })
        .toArray();
      const now = Date.now();

      // 1️⃣ Encerra workers que não estão mais ativos
      for (const [id, worker] of workers) {
        const stillActive = activeAutomations.some(
          (a) => a._id.toString() === id
        );
        if (!stillActive) {
          console.log(`🛑 Encerrando worker desativado: ${id}`);
          worker.terminate();
          workers.delete(id);
        }
      }

      let countRunned = 0;

      // 2️⃣ Processa automations ativos
      for (const automation of activeAutomations) {
        const id = automation._id.toString();
        const filename =
          strategyRunnerMap[
            automation.strategy.name as keyof typeof strategyRunnerMap
          ];

        if (!filename) continue;

        const lastHeartbeat = automation.lastHeartbeatAt
          ? new Date(automation.lastHeartbeatAt).getTime()
          : 0;
        const interval = automation.interval || 60_000;
        const diff = now - lastHeartbeat;

        // Se ainda não passou o intervalo, apenas ignora
        if (diff < interval) continue;

        countRunned++;

        // Cria o worker se ainda não existir
        if (!workers.has(id)) {
          console.log(`🚀 Criando worker para ${automation.name}`);

          const worker = new Worker(filename, { workerData: automation });

          workers.set(id, worker);

          worker.on("message", (msg) => {
            if (msg?.data?.type === "log" && msg?.data?.message)
              console.log(`[📨 ${automation.name}]`, msg.data.message);
          });

          worker.on("error", (err) => {
            console.error(`❌ [${automation.name}] erro:`, err);
          });

          worker.on("exit", (code) => {
            console.log(`💀 [${automation.name}] saiu com código ${code}`);
            workers.delete(id);
          });
        }

        // Envia mensagem de execução
        const worker = workers.get(id)!;
        worker.postMessage({ type: "run" });

        // Atualiza o lastHeartbeatAt no banco
        await automations.updateOne(
          { _id: automation._id },
          { $set: { lastHeartbeatAt: new Date() } }
        );
      }
      console.log(`✅ ${countRunned} automations runned`);
    } catch (err: any) {
      console.error("❌ Polling error:", err.message);
    }

    await new Promise((res) => setTimeout(res, globalPolling));
  }
}

main().catch((err) => console.error(err));
