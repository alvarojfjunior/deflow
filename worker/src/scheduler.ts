import "dotenv/config";
import "./server";
import { connectDb } from "./lib/db";
import { Collection, Db } from "mongodb";
import { AutomationDoc } from "./types/database";
import { runStrategyQueue } from "./queue";

let db: Db;

async function main() {
  if (!db) {
    db = await connectDb();
  }
  const globalPolling = Number(process.env.POOLING_INTERVAL || 60_000);
  console.log(`🧠 Scheduler started (polling every ${globalPolling / 1000}s)`);

  while (true) {
    try {
      const automations = db.collection(
        "automations"
      ) as Collection<AutomationDoc>;
      const activeAutomations = await automations
        .find({ status: "active" })
        .toArray();

      await removeAutomationsIfNeeded(activeAutomations);

      await addAutomationsJobIfNotExists(activeAutomations);

      console.log(`Running ${activeAutomations.length} automations.`);
    } catch (err: any) {
      console.error("❌ Polling error:", err.message);
    }
    await new Promise((res) => setTimeout(res, globalPolling));
  }
}

main().catch((err) => console.error(err));

async function addAutomationsJobIfNotExists(
  activeAutomations: AutomationDoc[]
) {
  for (const automation of activeAutomations) {
    const jobs = await runStrategyQueue.getJobSchedulers();
    const job = jobs.find(
      (j) => j.template?.data.automationId === automation._id.toString()
    );

    if (!job) {
      await runStrategyQueue.add(
        "run-strategy",
        {
          automationId: automation._id.toString(),
        },
        {
          jobId: automation._id.toString(),
          repeat: {
            every: automation.interval || 60_000,
          },
          attempts: 1,
          removeOnComplete: 50, // mantém só os últimos 100 jobs completos
          removeOnFail: 50, // mantém os últimos 100 falhos
        }
      );
      console.log(
        `Job ${automation._id.toString()} added to repeatable queue.`
      );
    }
  }
}

async function removeAutomationsIfNeeded(activeAutomations: AutomationDoc[]) {
  const jobs = await runStrategyQueue.getJobSchedulers();

  for (const job of jobs) {
    if (
      !activeAutomations.find(
        (a) => a._id.toString() === job.template?.data.automationId
      )
    ) {
      await runStrategyQueue.removeJobScheduler(job.key);
      console.log(`Job ${job.template?.data.automationId} is stopped.`);
    }
  }
}
