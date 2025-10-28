import { Db, ObjectId } from "mongodb";
import { WalletDoc } from "../../types/database";
import { getTokenBalances } from "../../lib/connectors/blockchain";
import { logMessage } from "../utils/logs";
import { getPools } from "../../lib/connectors/dex";
import { Automation } from "../../types/automation";

export default async (db: Db, automation: Automation) => {
  try {
    const start = Date.now();
    const wallets = db.collection<WalletDoc>("wallets");
    const wallet = await wallets.findOne({
      _id: new ObjectId(String(automation.strategy.params.walletId)),
    });
    if (!wallet) {
      throw new Error("Wallet not found");
    }

    // const balance = await getTokenBalances(wallet, "solana");
    // const pools = await getPools("orca");
    // logMessage(balance);
    // logMessage(pools);

    const elapsed = Date.now() - start;
    logMessage(`${automation.name} concluído em ${elapsed}ms`);

    return true;
  } catch (error) {
    logMessage(error);
    return false;
  }
};
