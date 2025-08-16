import { useEffect, useState } from "react";
import "./App.css";
import { useWasmerSdk, type LoadedSdkState } from "@wasi-demo/hooks";
import { initAppInline } from "@wasi-demo/core";

async function run(
  module: WebAssembly.Module,
  sdk: LoadedSdkState,
  input: string,
): Promise<string | void> {
  if (!sdk) {
    return;
  }
  const instance = await sdk.runWasix(module, {});
  if (instance.stdin) {
    console.warn(`Writing "${input}" to stdin...`);
    const stdin = instance.stdin.getWriter();
    const encoder = new TextEncoder();
    const encodedInput = encoder.encode(input);

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
