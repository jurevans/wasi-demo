import { useEffect, useState } from "react";
import "./App.css";
import { useWasmerSdk } from "@wasi-demo/hooks";
import { initWasmerApp } from "@wasi-demo/core";
import { default as initLib, Msg, MsgType } from "@wasi-demo/lib";
import { connectStreams } from "@wasi-demo/core/src/client/WasmerClient";
import { Directory, type Wasmer, type SpawnOptions } from "@wasmer/sdk";

function App() {
  const [results, setResults] = useState<string>();
  const [error, setError] = useState<Record<string, string>>();
  const sdk = useWasmerSdk();

  useEffect(() => {
    if (sdk.state === "loaded") {
      const onStdOut = (d: string) => {
        console.warn("onStdOut -> ", d);
        setResults(d);
      };
      const onStdErr = (e: string) => {
        console.error("onStdErr -> ", e);
        let error = {};

        try {
          error = {
            error: JSON.parse(e),
          };
        } catch (_) {
          error = {
            error: e,
          };
        }
        setError(error);
      };

      // initWasm().then(async (module) => {
      // const instance = await sdk.runWasix(module, {});

      initWasmerApp().then(async (wasmer: Wasmer) => {
        await initLib();
        const request = new Msg(
          "asdfasdf",
          MsgType.Request,
          new Uint8Array([0, 1, 2, 3]),
        );
        const home = new Directory();
        const opts: SpawnOptions = {
          mount: { "/home": home },
          cwd: "/home",
          env: {},
          // uses: ["wasmer/coreutils"],
          // uses: ["wasi/unstable"],
        };
        const instance = await wasmer.entrypoint!.run(opts);
        const writer = await connectStreams(instance, onStdOut, onStdErr);

        // await instance.wait();
        const encoder = new TextEncoder();
        const input = request.to_json();

        console.warn("Writing input: ", input, writer);
        await writer.write(encoder.encode(input));
        await writer.write(encoder.encode(input));
        await writer.write(encoder.encode(input));

        setTimeout(async () => {
          await writer.write(
            encoder.encode(new Msg("exit_id", MsgType.Exit).to_json()),
          );
        }, 2000);
      });
    }
  }, [sdk]);

  return (
    <>
      <h1>Wasmer Demo</h1>
      <div className="w-4">
        {typeof results === "undefined" && <p>Awaiting...</p>}
        <div>
          {/*{results && <pre>{JSON.stringify(JSON.parse(results), null, 2)}</pre>} */}
          {results && <pre>{results}</pre>}
          {error && (
            <pre className="text-red-700">{JSON.stringify(error, null, 2)}</pre>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
