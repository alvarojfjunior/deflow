import { Queue } from "bullmq";
import { Redis } from "ioredis";

export const connection = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
});


connection.on("connect", () => console.log("✅ Connected to Redis!"));
connection.on("error", (err) => console.error("❌ Redis error:", err));

export const myQueue = new Queue("run-strategy", { connection });
