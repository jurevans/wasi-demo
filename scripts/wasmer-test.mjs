import { spawn } from "child_process";
import path from "path";

const app = spawn(
  "wasmer",
  ["run", path.resolve("./packages/core/src/wasm/app.wasm"), "--quiet"],
  { stdio: "pipe" },
);

console.info("Spawned Wasmer process:", app.pid, "\n");

app.stdout.setEncoding("utf8");

function sendMsg(msg) {
  const encoder = new TextEncoder();
  console.log("[REQUEST]", msg);
  app.stdin.write(encoder.encode(`${msg}\r\n`));
}

const runner = () => {
  app.stdout.on("data", (data) => {
    console.log("[RESPONSE]", data);
  });
  app.stdout.on("error", (e) => console.error("[ERROR]", e));

  app.on("close", (code) => {
    console.log("[EXIT] App terminated:", code);
  });

  sendMsg(`{"id": "test-id-1", "msg_type": "Request"}`);
  sendMsg(`{"id": "test-id-2", "msg_type": "Request"}`);
  sendMsg(
    `{"id": "test-id-3", "msg_type": "Request", "payload": [0, 1, 2, 3, 4, 5]}`,
  );

  setTimeout(() => {
    sendMsg(`{"id": "exit-command", "msg_type": "Exit"}`);
  }, 2000);
};

runner();
