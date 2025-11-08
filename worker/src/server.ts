// src/dashboard.ts
import express from "express";
import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { runStrategyQueue } from "./queue";

const serverAdapter = new ExpressAdapter() as any;
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(runStrategyQueue)],
  serverAdapter,
});

const app = express();

app.use("/admin/queues", serverAdapter.getRouter());

app.listen(3000, () => {
  console.log("✅ Bull Board is running at http://localhost:3333/admin/queues");
});
