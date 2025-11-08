import { Queue } from "bullmq";
import { Redis } from "ioredis";

export const connection = new Redis({
  host: process.env.REDIS_HOST || "redis",
  port: Number(process.env.REDIS_PORT) || 6379,
});


connection.on("connect", () => console.log("✅ Connected to Redis!"));
connection.on("error", (err) => console.error("❌ Redis error:", err));

export const runStrategyQueue = new Queue("run-strategy", { connection });
