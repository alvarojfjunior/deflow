import { parentPort } from "worker_threads";

export function logMessage(data: any) {
  if (!parentPort) {
    throw new Error("parentPort not found");
  }
  parentPort.postMessage({
    type: "message",
    data: { type: "log", message: data },
  });
}

export default { logMessage };
