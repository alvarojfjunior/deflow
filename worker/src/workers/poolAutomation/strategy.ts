import { Db, ObjectId } from "mongodb";
import { connectDb } from "../../lib/db";
import { AutomationDoc } from "../../types/database";
import { Job } from "bullmq";
import { createHistory } from "../../lib/utils/history";

var db: Db;
var automation: AutomationDoc;

export default async (job: Job, automationId: string) => {
  try {
    if (!db) db = await connectDb();
    automation = (await db.collection<AutomationDoc>("automations").findOne({ _id: new ObjectId(automationId) })) as AutomationDoc;
    if (!automation) {
      throw new Error("Automation not found");
    } else if (automation.status !== "active") {
      return "Automation is not active";
    }
    // const wallet = db.collection<WalletDoc>("wallets").findOne({
    //   _id: new ObjectId(String(automation.strategy.params.walletId)),
    // });
    // if (!wallet) {
    //   throw new Error("Wallet not found");
    // }
    // const pools = await getPools("orca");
    // if (!pools) {
    //   throw new Error("Pools not found");
    // }

    // console.log(`[INSIDE WORKER] Found ${pools.length} pools`);

    //  if (automation.strategy.params.allocationMode === "PR/TVL") {
    //   pools.sort((a, b) => b.priceRatio - a.priceRatio);
    //  }

    // logMessage(pools);
    // const balance = await getTokenBalances(wallet, "solana");
    // logMessage(balance);

    await new Promise((resolve) => setTimeout(resolve, 10000)); // 1-minute delay
    await createHistory(db, automation, "empty-run");
  } catch (error) {
    await createHistory(db, automation, "error", error);
    console.log(
      `Error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};
