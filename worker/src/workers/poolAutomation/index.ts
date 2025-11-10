import { Worker } from "bullmq";
import { connection } from "../../queue";
import strategy from "./strategy";

const worker = new Worker(
  "run-strategy",
  async (job) => {
    await strategy(job, job.data.automationId);
  },
  {
    connection,
    concurrency: 1,
  }
);

worker.on("active", async (job) => {
  console.log(`🚀 Job ${job.id} started.`);
});


worker.on("completed", async (job) => {
  console.log(`✅ Job ${job.id} finished.`);
});

worker.on("failed", async (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err.message);
});

worker.on("error", (err) => {
  console.error("⚠️ General worker error:", err);
});
