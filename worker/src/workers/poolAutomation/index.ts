import { parentPort, workerData } from "worker_threads";
import strategy from "./strategy";
import { Db } from "mongodb";
import { connectDb } from "../../lib/db";
import { logMessage } from "../utils/logs";

const automation = workerData;

let db: Db;

parentPort?.on("message", async (msg) => {
  if (!parentPort || !automation || !msg) {
    throw new Error("Worker not initialized");
  }
  if (msg.type === "run") {
    if (!db) {
      db = await connectDb();
      logMessage(`Connected to database`);
    }
    await strategy(db, automation);
  }
});
