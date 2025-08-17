import { useEffect, useState } from "react";
import "./App.css";
import { useWasmerSdk } from "@wasi-demo/hooks";
import { initAppInline, type LoadedSdkState } from "@wasi-demo/core";
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
      "1234abcd",
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
    console.warn("RESULTS!", { result });
    if (result.ok) {
      return result.stdout;
    }
  }
}

function App() {
  const [results, setResults] = useState<string>();
  const sdk = useWasmerSdk();

  useEffect(() => {
    if (sdk.state === "loaded") {
      initAppInline().then(async (module) => {
        const output = await run(module, sdk, "It worked!");
        console.warn({ module, output });
        if (output) {
          setResults(output);
        }
        console.warn(output);
      });
    }
  }, [sdk]);

  return (
    <>
      <h1>Wasmer Demo</h1>
      <div className="card">
        {typeof results === "undefined" && (
          <div>Awaiting response from wasm...</div>
        )}
        {results && <div>{results}</div>}
      </div>
    </>
  );
}

export default App;
