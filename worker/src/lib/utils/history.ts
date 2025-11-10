import { Db } from "mongodb";
import { Automation } from "../../types/automation";

export const createHistory = async (
  db: Db,
  automation: Automation,
  action: string,
  params: any = {}
) => {
  await Promise.all([
    db.collection("histories").insertOne({
      automationId: automation._id,
      userId: automation.userId,
      action,
      params,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    db
      .collection<Automation>("automations")
      .updateOne(
        { _id: automation._id },
        { $set: { lastHeartbeatAt: new Date() } }
      ),
  ]);
};
