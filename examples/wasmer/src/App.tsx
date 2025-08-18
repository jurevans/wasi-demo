import { useEffect, useState } from "react";
import "./App.css";
import { useWasmerSdk } from "@wasi-demo/hooks";
import {
  initAppInline,
  WasmerClient,
  type LoadedSdkState,
} from "@wasi-demo/core";
import { default as init, Msg, MsgType } from "@wasi-demo/lib";

async function run(
  module: WebAssembly.Module,
  sdk: LoadedSdkState,
): Promise<string | void> {
  if (!sdk) {
    return;
  }
  const instance = await sdk.runWasix(module, {});
  if (instance.stdin) {
    await init();
    const msg = new Msg(
      "d3e7adb3ee3f",
      MsgType.Request,
      new Uint8Array([0, 1, 2, 3]),
    );
    const json = msg.to_json();
    console.warn(`Writing "${json}" to stdin...`);
    const stdin = instance.stdin.getWriter();
    const encoder = new TextEncoder();
    const encodedInput = encoder.encode(json);

    await stdin.write(encodedInput);
    await stdin.close();

    const result = await instance.wait();
    if (result.ok) {
      return result.stdout;
    }
    // const client = new WasmerClient(sdk);
    // await client.run(module);
    // await client.connectStreams();
    // client.dispatch(
    //   new Msg("id1", MsgType.Request, new Uint8Array([1, 2, 3, 4])).to_json(),
    // );
    // client.dispatch(
    //   new Msg("id2", MsgType.Request, new Uint8Array([1, 2, 3, 4])).to_json(),
    // );
    // setTimeout(() => {
    //   console.warn("Exiting...");
    //   client.dispatch(
    //     new Msg("exit", MsgType.Exit, new Uint8Array()).to_json(),
    //   );
    // }, 2000);
  }
}

function App() {
  const [results, setResults] = useState<string>();
  const sdk = useWasmerSdk();

  useEffect(() => {
    if (sdk.state === "loaded") {
      initAppInline().then(async (module) => {
        const output = await run(module, sdk);
        console.warn({ module, output });
        if (output) {
          setResults(output);
        }
        console.warn(output);
        // const client = new WasmerClient(sdk);
        // await client.connectStreams();
        // client.run(module);
        // setTimeout(() => {
        //   client.dispatch({
        //     id: "",
        //     msg_type: MsgType.Request,
        //     payload: new Uint8Array([]),
        //   });
        // }, 2000);
        //
      });
    }
  }, [sdk]);

  return (
    <>
      <h1>Wasmer Demo</h1>
      <div className="w-2">
        {typeof results === "undefined" && (
          <div>Awaiting response from wasm...</div>
        )}
        {results && <pre>{JSON.stringify(JSON.parse(results), null, 2)}</pre>}
      </div>
    </>
  );
}

export default App;
