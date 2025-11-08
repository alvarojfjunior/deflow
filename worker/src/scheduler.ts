import "dotenv/config";
import { connectDb } from "./lib/db";
import { Collection, Db } from "mongodb";
import { Automation } from "./types/automation";
import { myQueue } from "./queue";

let db: Db;

async function main() {
  if (!db) {
    db = await connectDb();
  }
  const automations = db.collection("automations") as Collection<Automation>;

  const globalPolling = Number(process.env.POOLING_INTERVAL || 60_000);
  console.log(`🧠 Scheduler started (polling every ${globalPolling / 1000}s)`);

  while (true) {
    try {
      const activeAutomations = await automations
        .find({ status: "active" })
        .toArray();
      const now = Date.now();

      // 2️⃣ Processa automations ativos
      for (const automation of activeAutomations) {
        const lastHeartbeat = automation.lastHeartbeatAt
          ? new Date(automation.lastHeartbeatAt).getTime()
          : 0;
        const interval = automation.interval || 60_000;
        const diff = now - lastHeartbeat;

        // Se ainda não passou o intervalo, apenas ignora
        if (diff < interval) continue;

        await myQueue.add("run-strategy", { db, automation });

        // Atualiza o lastHeartbeatAt no banco
        await automations.updateOne(
          { _id: automation._id },
          { $set: { lastHeartbeatAt: new Date() } }
        );
      }
    } catch (err: any) {
      console.error("❌ Polling error:", err.message);
    }

    await new Promise((res) => setTimeout(res, globalPolling));
  }
}

main().catch((err) => console.error(err));
