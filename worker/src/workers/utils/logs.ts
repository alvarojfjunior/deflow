import { MessagePort } from "worker_threads";

export function log(port: MessagePort, message: string) {
  port.postMessage({ type: "log", data: message });
}
