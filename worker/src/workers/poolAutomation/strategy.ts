import { Db } from "mongodb";
import { logMessage } from "../utils/logs";
import { getPools } from "../../lib/connectors/dex";
import { Automation } from "../../types/automation";

export default async (db: Db, automation: Automation) => {
  try {
    const start = Date.now();
    
    // const wallets = db.collection<WalletDoc>("wallets");
    // const wallet = await wallets.findOne({
    //   _id: new ObjectId(String(automation.strategy.params.walletId)),
    // });
    // if (!wallet) {
    //   throw new Error("Wallet not found");
    // }
     const pools = await getPools("orca");
     if (!pools) {
      throw new Error("Pools not found");
     }

     logMessage(pools[0].yieldOverTvl24h)

    //  if (automation.strategy.params.allocationMode === "PR/TVL") {
    //   pools.sort((a, b) => b.priceRatio - a.priceRatio);
    //  }
     
    // logMessage(pools);
    // const balance = await getTokenBalances(wallet, "solana");
    // logMessage(balance);


    const elapsed = Date.now() - start;
    logMessage(`${automation.name} concluído em ${elapsed}ms`);

    return true;
  } catch (error) {
    logMessage(error);
    return false;
  }
};
