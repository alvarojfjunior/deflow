import { Queue } from "bullmq";
import { Redis } from "ioredis";

export const connection = new Redis();

export const myQueue = new Queue("run-strategy", { connection });
