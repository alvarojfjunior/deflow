import { Automation } from "../../types/automation";
import { Job } from "bullmq";

export default async (job: Job, automation: Automation) => {
  try {
    job.log(
      `[Inside worker] Running strategy for automation ${automation.name}`
    );
    const start = Date.now();

    // const db = await connectDb();
    // const wallets = db.collection<WalletDoc>("wallets");
    // const wallet = await wallets.findOne({
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

    await new Promise(resolve => setTimeout(resolve, 60000)); // 1-minute delay

    const elapsed = Date.now() - start;
    console.log(`[Inside worker] ${automation.name} concluído em ${elapsed}ms`);

    return true;
  } catch (error) {
    console.log(
      `Error: ${error instanceof Error ? error.message : String(error)}`
    );
    return false;
  }
};
