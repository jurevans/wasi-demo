import { useEffect, useState } from "react";
import { WasmerSdkContext, type WasmerSdkState } from "@wasi-demo/hooks";
import type { init } from "@wasmer/sdk";

export type WasmerSdkProps = {
  /**
   * The filter passed to {@link initializeLogger}.
   */
  log?: string;
  wasm?: Parameters<typeof init>[0];
  children: React.ReactElement;
};

// Note: The wasm-bindgen glue code only needs to be initialized once, and
// initializing the logger multiple times will throw an exception, so we use a
// global variable to keep track of the in-progress initialization.
let pending: Promise<typeof import("@wasmer/sdk")> | undefined = undefined;

/**
 * A wrapper component which will automatically initialize the Wasmer SDK.
 */
export function WasmerSdkProvider(props?: WasmerSdkProps) {
  const [state, setState] = useState<WasmerSdkState>();

  useEffect(() => {
    if (typeof pending == "undefined") {
      pending = (async function () {
        const imported = await import("@wasmer/sdk");
        await imported.init({
          module: props?.wasm,
          log: props?.log,
        });
        return imported;
      })();
    }

    pending
      .then((sdk) => setState({ state: "loaded", ...sdk }))
      .catch((e) => setState({ state: "error", error: e }));
  }, [props?.wasm, props?.log]);

  return (
    <WasmerSdkContext.Provider value={state || { state: "loading" }}>
      {props?.children}
    </WasmerSdkContext.Provider>
  );
}
