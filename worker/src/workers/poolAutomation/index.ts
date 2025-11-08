import { Worker } from "bullmq";
import { connection } from "../../queue";
import strategy from "./strategy";

const worker = new Worker(
  "run-strategy",
  async (job) => {
    console.log(`Processing job ${job.id}:`, job.data);
    const { db, automation } = job.data;
    await strategy(db, automation);
    console.log("Strategy runned!");
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed: ${err.message}`);
});