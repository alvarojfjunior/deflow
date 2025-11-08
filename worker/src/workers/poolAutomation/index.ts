import { Worker } from "bullmq";
import { connection } from "../../queue";
import strategy from "./strategy";

const worker = new Worker(
  "run-strategy",
  async (job) => {
    job.log(`Processing job ${job.id}`);
    const { automation } = job.data;
    await strategy(job, automation);
    job.log("Strategy runned!");
  },
  { connection }
);


worker.on("completed", (job, result) => {
  console.log(`✅ Job ${job.id} finalizado. Resultado:`, result);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} falhou:`, err.message);
});

worker.on("error", (err) => {
  console.error("⚠️ Erro geral no worker:", err);
});