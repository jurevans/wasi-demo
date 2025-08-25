import type { Instance, Output } from "@wasmer/sdk";
import type { LoadedSdkState, MsgResponse } from "./types";

class WasmerClient {
  private _instance?: Instance;
  private _writer?: WritableStreamDefaultWriter;

  constructor(public readonly sdk: LoadedSdkState) {}

  dispatch(msg: string): void {
    if (!this._writer) {
      return;
    }
    const encoder = new TextEncoder();
    this._writer.write(encoder.encode(msg));
  }

  async connectStreams(): Promise<void> {
    if (!this._instance) {
      return;
    }
    const decoder = new TextDecoder();
    const stdoutStream = new WritableStream({
      write(chunk) {
        console.error("STDOUT", { chunk });
        const msg = JSON.parse(decoder.decode(chunk));
        WasmerClient.onRead(msg);
      },
    });
    const stderrStream = new WritableStream({
      write(chunk) {
        console.error("STDERR", { chunk });
        const msg = decoder.decode(chunk);
        // WasmerClient.onRead(msg);
        console.error("onError", msg);
      },
    });
    this._instance.stdout!.pipeTo(stdoutStream);
    this._instance.stderr!.pipeTo(stderrStream);
    this._writer = this._instance.stdin?.getWriter();
  }

  close() {
    this._writer?.close();
  }

  static onRead(msg: MsgResponse): void {
    alert(msg);
    console.warn("onRead", msg);
  }

  async run(
    module: WebAssembly.Module,
    wait = false,
  ): Promise<Output | undefined> {
    if (!this.sdk) {
      return;
    }
    this._instance = await this.sdk.runWasix(module, {});
    if (wait) {
      this._instance.wait();
    }
  }
}

export default WasmerClient;

/**
 * Testing
 */
export async function connectStreams(
  instance: Instance,
  onErr: (data: string) => void,
  onRead: (data: string) => void,
): Promise<WritableStreamDefaultWriter> {
  const decoder = new TextDecoder();
  const stdoutStream = new WritableStream({
    write(chunk) {
      const msg = decoder.decode(chunk);
      onRead(msg);
    },
  });
  const stderrStream = new WritableStream({
    write(chunk) {
      const msg = decoder.decode(chunk);
      onErr(msg);
    },
  });
  console.log("connectStreams", {
    instance,
    stdout: instance.stdout,
    stdin: instance.stdin,
    stderrr: instance.stderr,
  });
  instance.stdout!.pipeTo(stdoutStream);
  instance.stderr!.pipeTo(stderrStream);
  return instance.stdin!.getWriter();
}
