import type { Instance } from "@wasmer/sdk";
import type { LoadedSdkState, Msg, MsgResponse } from "./types";
import { streamToString } from "../utils";

class WasmerClient {
  private _instance?: Instance;
  private _isReading = false;

  constructor(public readonly sdk: LoadedSdkState) {}

  dispatch(msg: Msg): void {
    if (!this._instance) {
      return;
    }
    const stdin = this._instance.stdin?.getWriter();
    const encoder = new TextEncoder();
    stdin?.write(encoder.encode(JSON.stringify(msg)));
  }

  async read(): Promise<void> {
    if (!this._instance) {
      return;
    }
    const stderr = this._instance.stderr;
    if (stderr) {
      throw new Error(await streamToString(stderr));
    }
    const stdout = this._instance.stdout;
    const reader = stdout.getReader();
    while (this._isReading) {
      reader.read().then(({ done, value }) => {
        try {
          const json = JSON.parse(value);
          const { id, type, payload, status, error } = json;
          this.onRead({ id, type, payload, status, error });
        } catch (e) {
          console.error(e);
          this._isReading = false;
        } finally {
          if (done) {
            this._isReading = false;
          }
        }
      });
    }
  }

  async onRead(msg: MsgResponse): Promise<void> {
    console.info("onRead", msg);
  }

  async run(module: WebAssembly.Module): Promise<string | void> {
    if (!this.sdk) {
      return;
    }
    this._instance = await this.sdk.runWasix(module, {});
    this._isReading = true;
  }
}

export default WasmerClient;
