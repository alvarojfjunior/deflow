import { Worker } from "bullmq";
import { connection } from "../../queue";
import strategy from "./strategy";
import { connectDb } from "../../lib/db";
import { Collection, ObjectId } from "mongodb";
import { Automation } from "../../types/automation";

const worker = new Worker(
  "run-strategy",
  async (job) => {
    console.log(`Processing job ${job.id}`);
    const { automation } = job.data;
    await strategy(job, automation);
    console.log("Strategy runned!");
  },
  {
    connection,
    concurrency: 2,
    limiter: {
      max: 2,
      duration: 10_000,
    },
  }
);

worker.on("completed", async (job, result) => {
  console.log(`✅ Job ${job.id} finalizado.`);
  try {
    const db = await connectDb();
    const automations = db.collection<Automation>(
      "automations"
    ) as Collection<Automation>;
    const automationId = new ObjectId(String(job.data.automation._id));
    await automations.updateOne(
      { _id: automationId },
      { $set: { lastHeartbeatAt: new Date(), status: "active" } }
    );
  } catch (err: any) {
    console.error(
      "⚠️ Falha ao atualizar heartbeat/status após conclusão:",
      err.message
    );
  }
});

worker.on("failed", async (job, err) => {
  console.error(`❌ Job ${job?.id} falhou:`, err.message);
  try {
    const db = await connectDb();
    const automations = db.collection<Automation>(
      "automations"
    ) as Collection<Automation>;
    const automationId = new ObjectId(String(job?.data?.automation?._id));
    if (automationId) {
      await automations.updateOne(
        { _id: automationId },
        { $set: { lastHeartbeatAt: new Date(), status: "error" } }
      );
    }
  } catch (dbErr: any) {
    console.error(
      "⚠️ Falha ao atualizar heartbeat/status após erro:",
      dbErr.message
    );
  }
});

worker.on("error", (err) => {
  console.error("⚠️ Erro geral no worker:", err);
});
