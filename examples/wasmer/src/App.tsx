import { useEffect, useState } from "react";
import "./App.css";
import { useWasmerSdk } from "@wasi-demo/hooks";
import { default as initLib, Msg, MsgType } from "@wasi-demo/lib";
import { connectStreams, runWasiApp } from "@wasi-demo/core";
import { Instance } from "@wasmer/sdk";

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

      runWasiApp(sdk).then(async (instance: Instance) => {
        await initLib();
        const request = new Msg(
          "asdfasdf",
          MsgType.Request,
          new Uint8Array([0, 1, 2, 3]),
        );
        const requester = await connectStreams(instance, onStdOut, onStdErr);

        const input = request.toJson();

        console.warn("Writing input: ", input, requester);
        requester.write(input);

        setTimeout(async () => {
          requester.write(new Msg("exit_id", MsgType.Exit).toJson());
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
