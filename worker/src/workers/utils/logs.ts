import { MessagePort } from "worker_threads";

export function logMessage(port: MessagePort, data: any) {
  port.postMessage({ type: "message", data: { type: "log", message: data } });
}


export default { logMessage };
